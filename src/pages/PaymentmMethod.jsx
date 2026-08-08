import React, { useState, useContext } from "react";
import orderService from "../services/interface/orderService";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CartWishlistContext } from "../App";
import "../index.css";
import "../assets/css/PaymentmMethod.css";

const PaymentmMethod = () => {
  // رسالة نجاح الطلب
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");

  // استخدام Context لتصفير السلة
  const { clearCart } = useContext(CartWishlistContext);

  // دالة تجهيز وإرسال الطلب
  // دالة إرسال الطلب مع بيانات المودال
  const submitOrder = async ({
    paymentMethod = "bank_transfer",
    phone = "",
    address = "",
    note = "",
    bankImage = null,
  }) => {
    try {
      const cartItemsLS = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const cartNotes = JSON.parse(localStorage.getItem("cartNotes") || "{}");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const user = userData.user || {}; // استخراج بيانات المستخدم الصحيحة

      console.log("👤 بيانات المستخدم في PaymentMethod:", user);
      console.log("🆔 user_id الذي سيتم إرساله:", user?.id);

      // تجهيز عناصر الطلب
      const order_items = cartItemsLS.map((item) => ({
        product_id: item.id,
        quantity: item.quantity || 1,
        unit_price: parseFloat(item.price) || 0,
        subtotal: (parseFloat(item.price) || 0) * (item.quantity || 1),
        notes: cartNotes[item.id] || "",
      }));

      // حساب الإجمالي
      const total_amount = order_items.reduce(
        (acc, item) => acc + item.subtotal,
        0,
      );

      // تجهيز بيانات الطلب الأساسية
      const orderData = {
        order_number: `ORD-${Math.floor(Math.random() * 100000)}`,
        user_id: user?.id || null, // لا نضع قيمة افتراضية خاطئة
        total_amount,
        status: "pending",
        notes: note || Object.values(cartNotes).join(" | ") || "",
        payment_method: paymentMethod,
        // ⬅️ هنا نخليها JSON string عشان الباك اند عايز كده
        shipping_address: JSON.stringify({
          address: address || "---",
          phone: phone,
        }),
        order_items,
      };

      // تأكيد من وجود user_id صحيح
      if (!orderData.user_id) {
        console.error("❌ خطأ: لا يوجد user_id صحيح!");
        console.log("👤 بيانات المستخدم المتاحة:", user);
        throw new Error("لا يمكن إرسال الطلب بدون تسجيل الدخول");
      }

      // طباعة قبل الإرسال
      console.log("Order JSON sent to backend:", {
        ...orderData,
        payment_receipt: bankImage || null,
      });

      if (paymentMethod === "bank_transfer" && bankImage) {
        const formData = new FormData();

        // الحقول العادية - محسنة لضمان الحفظ الصحيح
        formData.append("order_number", orderData.order_number);
        formData.append("user_id", String(orderData.user_id)); // تأكيد أنه string
        formData.append("total_amount", String(orderData.total_amount));
        formData.append("status", orderData.status);
        formData.append("notes", orderData.notes || "");
        formData.append("payment_method", orderData.payment_method);
        formData.append("shipping_address", orderData.shipping_address);

        // إضافة بيانات المستخدم لضمان الفلترة في البروفايل
        if (user.name) formData.append("user_name", user.name);
        if (user.email) formData.append("user_email", user.email);
        if (user.phone) formData.append("user_phone", user.phone);

        console.log("📎 بيانات المستخدم المضافة لـ FormData:");
        console.log("  user_name:", user.name);
        console.log("  user_email:", user.email);
        console.log("  user_phone:", user.phone);

        // order_items كـ Array
        orderData.order_items.forEach((item, index) => {
          formData.append(`order_items[${index}][product_id]`, item.product_id);
          formData.append(`order_items[${index}][quantity]`, item.quantity);
          formData.append(`order_items[${index}][unit_price]`, item.unit_price);
          formData.append(`order_items[${index}][subtotal]`, item.subtotal);
          formData.append(`order_items[${index}][notes]`, item.notes || "");
        });

        // الملف
        formData.append("payment_receipt", bankImage);

        // طباعة FormData للتشخيص
        console.log("📎 FormData قبل الإرسال:");
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }

        // إرسال الطلب مع FormData
        const response = await orderService.createOrder(formData);
        console.log("✅ تم إرسال الطلب بنجاح (FormData):", response);
      } else {
        // الدفع عند الاستلام → JSON عادي
        const response = await orderService.createOrder(orderData);
        console.log("✅ تم إرسال الطلب بنجاح (JSON):", response);
      }

      setOrderSuccessMsg("تم إضافة الطلب بنجاح سيتم التواصل معك قريبًا!");

      // مسح السلة والملاحظات بعد نجاح العملية
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartNotes");

      // تصفير السلة في Context فوراً لتحديث العداد في Navbar
      if (clearCart) {
        clearCart();
        console.log("🗑️ تم تصفير السلة في Context فوراً");
      }

      // إرسال إشارة لتحديث جميع المكونات
      window.dispatchEvent(new CustomEvent("cartCleared"));
      console.log("🔔 تم إرسال إشارة cartCleared");
    } catch (err) {
      console.error("Order submission error:", err.response?.data || err);
      setOrderSuccessMsg("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    }
  };

  // حالة نافذة الدفع عند الاستلام
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashPhone, setCashPhone] = useState("");
  const [cashAddress, setCashAddress] = useState("");
  const [cashNote, setCashNote] = useState("");
  const [cashFormError, setCashFormError] = useState("");
  // جلب قيمة السلة من السياق
  const { cartItems } = useContext(CartWishlistContext);
  const location = useLocation();
  const product = location.state?.product;
  const paymentNumber = "01012345678";
  const bankNumber = "0123456789";
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankImage, setBankImage] = useState(null);
  const [bankImageError, setBankImageError] = useState("");
  const [showCashMsg, setShowCashMsg] = useState(false);
  const [cashStep, setCashStep] = useState(0); // 0: default, 1: موافق, 2: رسالة تأكيد
  const [bankStep, setBankStep] = useState(0);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [cashPhoneWarning, setCashPhoneWarning] = useState("");
  const [cashAddressWarning, setCashAddressWarning] = useState("");
  const [cashFormSubmitted, setCashFormSubmitted] = useState(false);

  const [bankPhone, setBankPhone] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [bankNote, setBankNote] = useState("");

  const [bankPhoneWarning, setBankPhoneWarning] = useState("");
  const [bankAddressWarning, setBankAddressWarning] = useState("");
  const [bankFormSubmitted, setBankFormSubmitted] = useState(false);

  useEffect(() => {
    document.title = "إتمام الدفع";
  }, []);

  function saveProductNote(productId, note) {
    const notes = JSON.parse(localStorage.getItem("cartNotes") || "{}");
    notes[productId] = note;
    localStorage.setItem("cartNotes", JSON.stringify(notes));
  }

  // دالة لجلب السعر كرقم
  const getPrice = (item) => {
    let price = item.price ?? item.unitPrice ?? 0;
    if (typeof price === "string") price = parseFloat(price);
    if (isNaN(price)) price = 0;
    return price;
  };
  // إذا وصل منتج من التنقل، استخدم سعره فقط
  const total = product
    ? getPrice(product) * (product.quantity || 1)
    : cartItems.reduce(
        (acc, item) => acc + getPrice(item) * (item.quantity || 1),
        0,
      );

  const handleBankClick = () => {
    setShowBankModal(true);
    setBankImageError("");
  };

  // إغلاق النافذة عند الضغط خارجها
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      handleCloseModal();
    }
  };

  const handleCashClick = () => {
    setShowCashModal(true);
    setCashStep(0);
    setCashPhone("");
    setCashAddress("");
    setCashNote("");
    setCashFormError("");
  };

  const handleCloseModal = () => {
    setShowBankModal(false);
    setBankImage(null);
    setBankImageError("");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBankImage(e.target.files[0]);
      setBankImageError("");
    }
  };

  const handleBankSubmit = (e) => {
    e.preventDefault();
    setBankFormSubmitted(true);

    let valid = true;

    if (!bankImage) {
      setBankImageError("يجب رفع صورة التحويل البنكي");
      valid = false;
    } else {
      setBankImageError("");
    }

    if (!bankPhone.trim()) {
      setBankPhoneWarning("يرجى إدخال رقم الهاتف");
      valid = false;
    } else if (bankPhone.length < 11 || bankPhone.length > 12) {
      setBankPhoneWarning("رقم الهاتف يجب أن يكون من 11 إلى 12 رقمًا.");
      valid = false;
    } else {
      setBankPhoneWarning("");
    }

    if (!bankAddress.trim()) {
      setBankAddressWarning("يرجى إدخال العنوان");
      valid = false;
    } else if (bankAddress.trim().length < 5) {
      setBankAddressWarning("العنوان يجب أن يحتوي على 5 حروف على الأقل.");
      valid = false;
    } else {
      setBankAddressWarning("");
    }

    if (!valid) return;

    setShowBankModal(false);
    setBankStep(1);
  };

  useEffect(() => {
    if (cashStep === 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // تأخير التنقل لتجنب مشكلة التحديث أثناء الرندر
            setTimeout(() => {
              navigate("/");
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cashStep, navigate]);

  useEffect(() => {
    if (bankStep === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bankStep, navigate]);

  return (
    <div className="payment-container">
      <div className="payment-box wide">
        <h2 className="main-title">إتمام عملية الدفع</h2>
        <p className="desc-text">
          إجمالي قيمة الطلب:{" "}
          <span className="total">{total.toFixed(2)} ر.س</span>
        </p>
        <p className="desc-text">
          يرجى تحويل المبلغ إلى رقم الحساب التالي:
          <span className="pay-number"> {paymentNumber} </span>
        </p>
        <div className="payment-options row">
          {/* رسالة نجاح الطلب */}
          {orderSuccessMsg && (
            <div
              style={{
                background: "#e6ffe6",
                color: "#1a7f37",
                borderRadius: "12px",
                padding: "1.2rem",
                marginBottom: "1.2rem",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 2px 12px #b2f5ea",
                textAlign: "center",
              }}
            >
              {orderSuccessMsg}
            </div>
          )}
          <div className="option">
            {cashStep === 0 && bankStep === 0 && !showCashModal && (
              <button className="pay-btn cash" onClick={handleCashClick}>
                الدفع عند الاستلام
              </button>
            )}

            {showCashModal && (
              <div
                className="modal-overlay"
                onClick={(e) => {
                  if (e.target.classList.contains("modal-overlay")) {
                    setShowCashModal(false);
                    setCashFormError("");
                  }
                }}
              >
                <div
                  className="modal-content wide-modal"
                  style={{ position: "relative" }}
                >
                  <button
                    className="modal-close-x"
                    style={{ left: "18px", top: "18px", position: "absolute" }}
                    onClick={() => {
                      setShowCashModal(false);
                      setCashFormError("");
                    }}
                    title="إغلاق النافذة"
                  >
                    &#10006;
                  </button>
                  <h3
                    style={{
                      color: "var(--primary-color)",
                      fontWeight: "bold",
                    }}
                  >
                    الدفع عند الاستلام
                  </h3>
                  <form
                    className="bank-form"
                    style={{ marginTop: "1.2rem" }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setCashFormSubmitted(true);
                      let valid = true;
                      if (!cashPhone.trim()) {
                        setCashPhoneWarning("يرجى إدخال رقم الهاتف");
                        valid = false;
                      } else if (
                        cashPhone.length < 11 ||
                        cashPhone.length > 12
                      ) {
                        setCashPhoneWarning(
                          "رقم الهاتف يجب أن يكون من 11 إلى 12 رقمًا.",
                        );
                        valid = false;
                      } else {
                        setCashPhoneWarning("");
                      }
                      if (!cashAddress.trim()) {
                        setCashAddressWarning("يرجى إدخال العنوان");
                        valid = false;
                      } else if (cashAddress.trim().length < 5) {
                        setCashAddressWarning(
                          "العنوان يجب أن يحتوي على 5 حروف على الأقل.",
                        );
                        valid = false;
                      } else {
                        setCashAddressWarning("");
                      }
                      if (!valid) return;
                      setCashFormError("");
                      setShowCashModal(false);
                      setCashStep(2);
                      // إرسال الطلب بعد نجاح التحقق
                      await submitOrder({
                        paymentMethod: "cod",
                        phone: cashPhone,
                        address: cashAddress,
                        note: cashNote,
                      });
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                    >
                      <div style={{ flex: 1 }}>
                        <label htmlFor="cash-phone">
                          رقم الهاتف{" "}
                          <span className="required-red">(إجباري)</span>
                        </label>
                        <input
                          type="number"
                          id="cash-phone"
                          value={cashPhone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCashPhone(value);
                            if (value.length < 11 || value.length > 12) {
                              setCashPhoneWarning(
                                "رقم الهاتف يجب أن يكون من 11 إلى 12 رقمًا.",
                              );
                            } else {
                              setCashPhoneWarning("");
                            }
                          }}
                          required
                          style={{
                            borderRadius: "8px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            width: "100%",
                          }}
                          placeholder="أدخل رقم الهاتف هنا"
                        />
                        {cashFormSubmitted && cashPhoneWarning && (
                          <div className="error-message">
                            {cashPhoneWarning}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <label htmlFor="cash-address">
                          العنوان <span className="required-red">(إجباري)</span>
                        </label>
                        <input
                          type="text"
                          id="cash-address"
                          value={cashAddress}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCashAddress(value);
                            if (value.trim().length < 5) {
                              setCashAddressWarning(
                                "العنوان يجب أن يحتوي على 5 حروف على الأقل.",
                              );
                            } else {
                              setCashAddressWarning("");
                            }
                          }}
                          required
                          style={{
                            borderRadius: "8px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            width: "100%",
                          }}
                          placeholder="أدخل العنوان هنا"
                        />
                        {cashFormSubmitted && cashAddressWarning && (
                          <div className="error-message">
                            {cashAddressWarning}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: "1.2rem" }}>
                      <label htmlFor="cash-note">أضف ملاحظتك هنا</label>
                      <textarea
                        id="cash-note"
                        value={cashNote}
                        onChange={(e) => {
                          const note = e.target.value;
                          setCashNote(note);
                          saveProductNote("cash", note);
                        }}
                        rows={4}
                        style={{
                          borderRadius: "8px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          resize: "none",
                          width: "100%",
                        }}
                        placeholder="أضف ملاحظتك هنا (اختياري)"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="submit-btn"
                      style={{ marginTop: "10px" }}
                    >
                      موافق
                    </button>
                  </form>
                </div>
              </div>
            )}
            {cashStep === 2 && (
              <div
                className="pay-message success"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  color: "var(--primary-color)",
                  background: "#e6ffe6",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div>تم استلام طلبك وسيتم الدفع عند الاستلام</div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.95em" }}>
                  سيتم توجيهك تلقائيًا للصفحة الرئيسية خلال {countdown} ثانية...
                </div>
              </div>
            )}
          </div>
          <div className="option">
            {cashStep === 0 && bankStep === 0 && !showCashModal && (
              <button className="pay-btn bank" onClick={handleBankClick}>
                الدفع عبر التحويل البنكي
              </button>
            )}

            {bankStep === 1 && (
              <div
                className="pay-message success"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  color: "var(--primary-color)",
                  background: "#e6ffe6",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div>تم استلام بيانات التحويل بنجاح وسيتم مراجعتها</div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.95em" }}>
                  سيتم توجيهك تلقائيًا للصفحة الرئيسية خلال {countdown} ثانية...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نافذة البنك */}
      {showBankModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content wide-modal bank-modal">
            <button
              className="modal-close-x"
              onClick={handleCloseModal}
              title="إغلاق النافذة"
            >
              &#10006;
            </button>
            <h3>الدفع عبر التحويل البنكي</h3>
            <div
              className="order-total-modal"
              style={{
                margin: "1rem 0",
                fontWeight: "bold",
                fontSize: "1.15em",
              }}
            >
              إجمالي قيمة الطلب:{" "}
              <span className="total">{total.toFixed(2)} ر.س</span>
            </div>
            <p className="desc-text">
              يرجى تحويل قيمة الطلب إلى رقم الحساب التالي:
              <span className="bank-number"> {bankNumber} </span>
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBankFormSubmitted(true);
                let valid = true;
                if (!bankImage) {
                  setBankImageError("يجب رفع صورة التحويل البنكي");
                  valid = false;
                } else {
                  setBankImageError("");
                }
                if (!bankPhone.trim()) {
                  setBankPhoneWarning("يرجى إدخال رقم الهاتف");
                  valid = false;
                } else if (bankPhone.length < 11 || bankPhone.length > 12) {
                  setBankPhoneWarning(
                    "رقم الهاتف يجب أن يكون من 11 إلى 12 رقمًا.",
                  );
                  valid = false;
                } else {
                  setBankPhoneWarning("");
                }
                if (!bankAddress.trim()) {
                  setBankAddressWarning("يرجى إدخال العنوان");
                  valid = false;
                } else if (bankAddress.trim().length < 5) {
                  setBankAddressWarning(
                    "العنوان يجب أن يحتوي على 5 حروف على الأقل.",
                  );
                  valid = false;
                } else {
                  setBankAddressWarning("");
                }
                if (!valid) return;
                setShowBankModal(false);
                setBankStep(1);
                // إرسال الطلب بعد نجاح التحقق
                setTimeout(async () => {
                  await submitOrder({
                    paymentMethod: "bank_transfer",
                    phone: bankPhone,
                    address: bankAddress,
                    note: bankNote,
                    bankImage,
                  });
                }, 0);
              }}
              className="bank-form"
            >
              <label htmlFor="bank-image" style={{ marginBottom: "0.5rem" }}>
                صورة إيصال التحويل{" "}
                <span className="required-red">(إجباري)</span>
              </label>
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <input
                  type="file"
                  id="bank-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="bank-image"
                  className="upload-label"
                  style={{
                    display: "block",
                    padding: "12px",
                    border: "2px dashed #aaa",
                    borderRadius: "10px",
                    textAlign: "center",
                    background: "#f9f9f9",
                    cursor: "pointer",
                    fontSize: "1.05rem",
                    transition: "background 0.2s",
                  }}
                >
                  اضغط هنا لاختيار صورة الإيصال
                </label>
              </div>

              {bankImageError && (
                <div className="error-message">{bankImageError}</div>
              )}

              {/* عرض الصورة بعد الاختيار */}
              {bankImage && (
                <div
                  style={{
                    position: "relative",
                    marginTop: "1rem",
                    display: "inline-block",
                    maxWidth: "100%",
                  }}
                >
                  <img
                    src={URL.createObjectURL(bankImage)}
                    alt="الإيصال"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "220px",
                      borderRadius: "12px",
                      border: "2px solid #ccc",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => setBankImage(null)}
                    style={{
                      position: "absolute",
                      top: "-25px",
                      left: "-10px",
                      color: "#000",
                      background: "none",
                      border: "none",
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      fontSize: "2.5rem",
                      cursor: "pointer",
                    }}
                    title="حذف الصورة"
                  >
                    ×
                  </button>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginTop: "1.2rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label htmlFor="bank-phone">
                    رقم الهاتف <span className="required-red">(إجباري)</span>
                  </label>
                  <input
                    type="number"
                    id="bank-phone"
                    value={bankPhone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBankPhone(value);
                      if (value.length < 11 || value.length > 12) {
                        setBankPhoneWarning(
                          "رقم الهاتف يجب أن يكون من 11 إلى 12 رقمًا.",
                        );
                      } else {
                        setBankPhoneWarning("");
                      }
                    }}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      width: "100%",
                    }}
                    placeholder="أدخل رقم الهاتف"
                  />
                  {bankFormSubmitted && bankPhoneWarning && (
                    <div className="error-message">{bankPhoneWarning}</div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="bank-address">
                    العنوان <span className="required-red">(إجباري)</span>
                  </label>
                  <input
                    type="text"
                    id="bank-address"
                    value={bankAddress}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBankAddress(value);
                      if (value.trim().length < 5) {
                        setBankAddressWarning(
                          "العنوان يجب أن يحتوي على 5 حروف على الأقل.",
                        );
                      } else {
                        setBankAddressWarning("");
                      }
                    }}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      width: "100%",
                    }}
                    placeholder="أدخل العنوان"
                  />
                  {bankFormSubmitted && bankAddressWarning && (
                    <div className="error-message">{bankAddressWarning}</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "1.2rem" }}>
                <label htmlFor="bank-note">ملاحظات إضافية</label>
                <textarea
                  id="bank-note"
                  value={bankNote}
                  onChange={(e) => {
                    const note = e.target.value;
                    setBankNote(note);
                    saveProductNote("bank", note); // "bank" ممكن تستخدمه كـ ID ثابت للدفع البنكي
                  }}
                  rows={4}
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    resize: "none",
                    width: "100%",
                  }}
                  placeholder="أضف ملاحظتك هنا (اختياري)"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                إرسال الإيصال
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PaymentmMethod;
