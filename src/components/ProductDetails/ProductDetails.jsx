import React, { useEffect, useState, useContext } from "react";
import "../../assets/css/product.css";
import { CartWishlistContext } from "../../App";
import { useNavigate } from "react-router-dom";
import specialOrderService from "../../services/specialOrderService";

// Style for input fields
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "10px",
};

export default function ProductDetails({ product }) {
  const [mainImage, setMainImage] = useState("");
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    size: "",
  });
  const [dimensionsError, setDimensionsError] = useState({
    length: "",
    width: "",
    height: "",
    size: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, addToCart, removeFromCart, addToWishlist } =
    useContext(CartWishlistContext);
  const navigate = useNavigate();

  // خلي الصورة الأساسية الافتراضية هي اللي تيجي من المنتج
  useEffect(() => {
    if (product?.main_image) {
      setMainImage(product.main_image);
    }
  }, [product]);

  // تأثير الزووم
  useEffect(() => {
    const mainProductImage = document.getElementById("mainProductImage");
    const mainImageContainer = document.querySelector(".main-image-container");

    if (!mainProductImage || !mainImageContainer) return;

    const handleMouseMove = (e) => {
      const rect = mainImageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const imgWidth = mainProductImage.offsetWidth;
      const imgHeight = mainProductImage.offsetHeight;
      const backgroundX = (x / imgWidth) * 100;
      const backgroundY = (y / imgHeight) * 100;
      mainProductImage.style.transformOrigin = `${backgroundX}% ${backgroundY}%`;
      mainProductImage.style.transform = "scale(2.5)";
    };

    const handleMouseLeave = () => {
      mainProductImage.style.transform = "scale(1)";
      mainProductImage.style.transformOrigin = "center center";
    };

    mainImageContainer.addEventListener("mousemove", handleMouseMove);
    mainImageContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      mainImageContainer.removeEventListener("mousemove", handleMouseMove);
      mainImageContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mainImage]);

  const featuresList = product.features ? product.features.split("\r\n") : [];

  // تحقق هل المنتج في السلة
  const inCart = cartItems.some((item) => item.id === product.id);

  // التحقق من صحة الملف المرفق
  const validateFile = (file) => {
    if (!file) return true; // الملف اختياري

    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
      'application/pdf'
    ];
    const maxSize = 10 * 1024 * 1024; // 10 ميجابايت

    if (!allowedTypes.includes(file.type)) {
      setFileError("نوع الملف غير مسموح. يُسمح فقط بالصور (JPG, PNG, GIF, BMP) أو ملفات PDF.");
      return false;
    }

    if (file.size > maxSize) {
      setFileError("حجم الملف كبير جداً. الحد الأقصى المسموح 10 ميجابايت.");
      return false;
    }

    setFileError("");
    return true;
  };

  const validateFields = () => {
    let isValid = true;
    const errors = {
      length: "",
      width: "",
      height: "",
      size: "",
      quantity: "",
      phone: "",
    };

    // تحقق من الحقول مع السماح بالأرقام العشرية والمئوية
    if (!dimensions.length) {
      errors.length = "الطول مطلوب.";
      isValid = false;
    } else if (!/^\d*\.?\d+$/.test(dimensions.length)) {
      errors.length = "الطول يجب أن يكون رقم صحيح أو عشري.";
      isValid = false;
    } else if (parseFloat(dimensions.length) <= 0) {
      errors.length = "الطول يجب أن يكون أكبر من صفر.";
      isValid = false;
    }

    if (!dimensions.width) {
      errors.width = "العرض مطلوب.";
      isValid = false;
    } else if (!/^\d*\.?\d+$/.test(dimensions.width)) {
      errors.width = "العرض يجب أن يكون رقم صحيح أو عشري.";
      isValid = false;
    } else if (parseFloat(dimensions.width) <= 0) {
      errors.width = "العرض يجب أن يكون أكبر من صفر.";
      isValid = false;
    }

    if (!dimensions.height) {
      errors.height = "الارتفاع مطلوب.";
      isValid = false;
    } else if (!/^\d*\.?\d+$/.test(dimensions.height)) {
      errors.height = "الارتفاع يجب أن يكون رقم صحيح أو عشري.";
      isValid = false;
    } else if (parseFloat(dimensions.height) <= 0) {
      errors.height = "الارتفاع يجب أن يكون أكبر من صفر.";
      isValid = false;
    }

    if (!dimensions.size) {
      errors.size = "المقاس مطلوب.";
      isValid = false;
    }

    // تحقق من الكمية
    if (!dimensions.quantity) {
      errors.quantity = "الكمية مطلوبة.";
      isValid = false;
    } else if (!/^\d+$/.test(dimensions.quantity)) {
      errors.quantity = "الكمية يجب أن تكون رقم صحيح.";
      isValid = false;
    } else if (parseInt(dimensions.quantity) <= 0) {
      errors.quantity = "الكمية يجب أن تكون أكبر من صفر.";
      isValid = false;
    }

    // تحقق من رقم الهاتف
    if (!dimensions.phone) {
      errors.phone = "رقم الهاتف مطلوب.";
      isValid = false;
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(dimensions.phone)) {
      errors.phone = "رقم الهاتف غير صحيح (يجب أن يكون من 10-15 رقم).";
      isValid = false;
    }

    setDimensionsError(errors);

    // التحقق من الملف
    if (!validateFile(selectedFile)) {
      isValid = false;
    }

    return isValid;
  };

  // إرسال الطلب الخاص إلى API
  const submitSpecialOrder = async () => {
    try {
      setIsSubmitting(true);
      
      // التحقق من وجود المستخدم
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('يرجى تسجيل الدخول أولاً لإرسال الطلب الخاص');
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.user?.id || user.id;
      
      if (!userId) {
        alert('خطأ في بيانات المستخدم، يرجى تسجيل الدخول مرة أخرى');
        return;
      }

      // إعداد البيانات للإرسال
      const orderData = {
        product_id: product.id,
        user_id: userId,
        length: dimensions.length || '0',
        width: dimensions.width || '0',
        height: dimensions.height || '0',
        size: dimensions.size || '',
        quantity: dimensions.quantity || '1',
        phone: dimensions.phone || '',
        note: note.trim()
      };

      console.log('📝 إرسال الطلب الخاص إلى API...');
      console.log('البيانات المرسلة:', orderData);

      // إرسال الطلب إلى API
      let response;
      if (selectedFile) {
        // إذا كان هناك ملف مرفق، استخدم FormData
        const formData = new FormData();
        Object.keys(orderData).forEach(key => {
          formData.append(key, orderData[key]);
        });
        formData.append('attachment_file', selectedFile);
        
        console.log('📎 إرسال مع ملف مرفق:', selectedFile.name);
        response = await specialOrderService.createSpecialOrder(formData);
      } else {
        // إذا لم يكن هناك ملف، استخدم JSON
        response = await specialOrderService.createSpecialOrder(orderData);
      }
      
      console.log('✅ تم إرسال الطلب الخاص بنجاح:', response.data);
      
      return true;
    } catch (error) {
      console.error('❌ خطأ في إرسال الطلب الخاص:', error);
      
      let errorMessage = 'حدث خطأ في إرسال الطلب الخاص';
      
      if (error.response?.status === 422) {
        console.log('📋 تفاصيل خطأ التحقق:', error.response.data);
        const errors = error.response.data?.errors;
        if (errors) {
          errorMessage = 'أخطاء في البيانات:\n' + Object.values(errors).flat().join('\n');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'غير مصرح لك، يرجى تسجيل الدخول مرة أخرى';
      } else if (error.response?.status === 500) {
        errorMessage = 'خطأ في الخادم، يرجى المحاولة مرة أخرى';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* رسالة النجاح */}
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "15px 20px",
            borderRadius: "8px",
            border: "1px solid #c3e6cb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 9999,
            fontSize: "16px",
            fontWeight: "600",
            direction: "rtl",
            minWidth: "250px",
            animation: "slideInLeft 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="#155724"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            تم إرسال الطلب الخاص بنجاح
          </div>
        </div>
      )}
      <section className="product-details-section container">
        <div className="product-wrapper">
          {/* Product Info */}
          <div className="product-info-column" data-aos="fade-down">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-description">{product.description}</p>

            <div className="product-price">
              <span className="current-price">{product.price} ريال</span>
              {product.compare_price && (
                <span className="old-price">{product.compare_price} ريال</span>
              )}
            </div>

            {product.compare_price && (
              <div
                className="discount-badge"
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  fontSize: "19px",
                }}
              >
                خصم :{" "}
                {Math.round(
                  ((product.compare_price - product.price) /
                    product.compare_price) *
                    100
                )}
                %
              </div>
            )}

            {/* Quantity */}
            <div className="product-options">
              <div className="quantity-selector">
                <label htmlFor="quantity">الكمية:</label>
                <input type="number" id="quantity" defaultValue="1" min="1" />
              </div>

              {/* Colors */}
              {product.variants &&
                product.variants
                  .filter((v) => v.name === "اللون")
                  .map((variant) => (
                    <div className="color-selector" key={variant.id}>
                      <label>{variant.name}:</label>
                      <div className="color-options">
                        {variant.values.map((val) => (
                          <span
                            key={val.id}
                            className="color-item"
                            style={{
                              backgroundColor: val.color_name,
                              border: "1px solid #ccc",
                            }}
                            onClick={() =>
                              console.log("Selected Color:", val.value)
                            }
                          ></span>
                        ))}
                      </div>
                    </div>
                  ))}

              {/* Sizes */}
              {product.variants &&
                product.variants
                  .filter((v) => v.name === "المقاس")
                  .map((variant) => (
                    <div className="size-selector" key={variant.id}>
                      <label>{variant.name}:</label>
                      <div className="size-options">
                        {variant.values.map((val) => (
                          <span key={val.id} className="size-item">
                            {val.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

              {/* رابط نصي لفتح نافذة الملاحظة */}
              {inCart ? (
                <div
                  className="note-text-link"
                  style={{
                    marginTop: "10px",
                    direction: "rtl",
                    fontSize: "21px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textAlign: "center",
                    color: "red",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                  onClick={() => {
                    const modal = document.getElementById("noteModal");
                    if (modal) modal.style.display = "flex";
                  }}
                >
                  إضغط هنا حتى يمكنك كتابة طلب خاص للبائع تخص الطلب.
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "10px",
                    background: "#fa0f0fff",
                    color: "#fff",
                    padding: "15px 25px",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "21px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  لإضافه طلب خاص للبائع تخص الطلب،أضف المنتج إلى السلة أولاً
                </div>
              )}
            </div>

            {/* زر السلة ديناميكي */}
            {inCart ? (
              <button
                className="add-to-cart-button btn btn-danger"
                onClick={() => removeFromCart(product)}
              >
                إزالة من السلة
              </button>
            ) : (
              <button
                className="add-to-cart-button btn btn-primary"
                onClick={() => addToCart(product)}
              >
                أضف إلى السلة
              </button>
            )}

            <button
              className="buy-now-button"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/PaymentmMethod", { state: { product } });
              }}
            >
              اشترِ الآن
            </button>

            {/* Features */}
            <div className="product-features">
              <h3>المميزات الرئيسية:</h3>
              <ul>
                {featuresList.map((feat, index) => (
                  <li key={index}>{feat}</li>
                ))}
              </ul>
              <h3>تفاصيل إضافية:</h3>
              <p className="extra-details">{product.details}</p>
            </div>
          </div>

          {/* Images */}
          <div className="product-images-column">
            <div className="main-image-container" data-aos="fade-up">
              <div className="zoomable">
                <img
                  id="mainProductImage"
                  src={mainImage}
                  alt={product.name}
                  className="main-product-image zoomable__img"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="thumbnail-gallery-sidebar" data-aos="fade-down">
              <div className="scroll-container">
                {[
                  product.main_image,
                  ...(product.images || []).map((img) => img.full_url),
                ].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`صورة ${index + 1}`}
                    className={`thumbnail-item ${
                      mainImage === img ? "active" : ""
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* نافذة الملاحظة */}
          <div
            id="noteModal"
            onClick={(e) => {
              if (e.target.id === "noteModal") {
                e.target.style.display = "none";
              }
            }}
            style={{
              display: "none",
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1000,
              justifyContent: "center",
              alignItems: "center",
              direction: "rtl",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()} // يمنع إغلاق النافذة عند الضغط بداخلها
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                width: "90%",
                maxWidth: "550px",
                maxHeight: "90vh",
                boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
                textAlign: "right",
                position: "relative",
                animation: "fadeInUp 0.3s ease-in-out",
                margin: "10px",
                overflowY: "auto",
              }}
            >
              {/* زر إغلاق "×" */}
              <button
                onClick={() => {
                  const modal = document.getElementById("noteModal");
                  if (modal) modal.style.display = "none";
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "15px",
                  background: "transparent",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#000",
                }}
                aria-label="إغلاق"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
                طلب خاص
              </h3>

              <div
                style={{
                  marginBottom: "15px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      الطول (سم)
                    </label>
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, length: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        border: dimensionsError.length ? "1px solid red" : "1px solid #ddd"
                      }}
                      placeholder="أدخل الطول (مثال: 10.5)"
                    />
                    {dimensionsError.length && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {dimensionsError.length}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      العرض (سم)
                    </label>
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, width: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        border: dimensionsError.width ? "1px solid red" : "1px solid #ddd"
                      }}
                      placeholder="أدخل العرض (مثال: 15.75)"
                    />
                    {dimensionsError.width && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {dimensionsError.width}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      الارتفاع (سم)
                    </label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, height: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        border: dimensionsError.height ? "1px solid red" : "1px solid #ddd"
                      }}
                      placeholder="أدخل الارتفاع (مثال: 8.25)"
                    />
                    {dimensionsError.height && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {dimensionsError.height}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      المقاس
                    </label>
                    <input
                      type="number"
                      value={dimensions.size}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, size: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        border: dimensionsError.size ? "1px solid red" : "1px solid #ddd"
                      }}
                      placeholder="أدخل المقاس"
                    />
                    
                    {dimensionsError.size && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {dimensionsError.size}
                      </span>
                    )}
                  </div>
                </div>

                {/* الكمية ورقم التواصل - بجانب بعض */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      الكمية
                    </label>
                    <input
                      type="number"
                      value={dimensions.quantity || ""}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, quantity: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        border: dimensionsError.quantity ? "1px solid red" : "1px solid #ddd"
                      }}
                      placeholder="أدخل الكمية المطلوبة"
                      min="1"
                    />
                    {dimensionsError.quantity && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {dimensionsError.quantity}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      رقم التواصل
                    </label>
                    <input
                      type="number"
                      value={dimensions.phone || ""}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, phone: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        border: dimensionsError.phone ? "1px solid red" : "1px solid #ddd"
                      }}
                      placeholder="أدخل رقم الهاتف للتواصل"
                    />
                    {dimensionsError.phone && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        {dimensionsError.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                    }}
                  >
                    المرفقات
                  </label>
                  <div
                    className="img-pdf"
                    style={{
                      border: fileError ? "1px dashed red" : "1px dashed #ccc",
                      padding: "10px",
                      borderRadius: "6px",
                      textAlign: "center",
                      transition: "all 0.3s",
                    }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        validateFile(file);
                      }}
                    />
                    <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                      <i
                        className="fa-solid fa-upload"
                        style={{ marginLeft: "5px" }}
                      ></i>
                      {selectedFile
                        ? selectedFile.name
                        : "رفع ملف (صور: JPG, PNG, GIF, BMP - مستندات: PDF)"}
                    </label>
                    {fileError && (
                      <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                        {fileError}
                      </div>
                    )}
                    <div style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>
                      الحد الأقصى للحجم: 10 ميجابايت
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                    }}
                  >
                    ملاحظات إضافية
                  </label>
                  <textarea
                    placeholder="أضف ملاحظاتك هنا"
                    rows="4"
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                      if (e.target.value.trim().length >= 5) {
                        setNoteError("");
                      }
                    }}
                    style={{
                      width: "100%",
                      borderRadius: "6px",
                      border: `1px solid ${noteError ? "red" : "#ddd"}`,
                      padding: "10px",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      resize: "none",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  ></textarea>
                </div>
                
              </div>
              {noteError && (
                <p style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
                  {noteError}
                </p>
              )}
              <button
                className="review"
                style={{
                  marginTop: "15px",
                  background: isSubmitting ? "#ccc" : "var(--primary-color)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  width: "100%",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                disabled={isSubmitting}
                onClick={async () => {
                  const trimmedNote = note.trim();

                  // التحقق من الحقول
                  if (!validateFields()) {
                    return; // إذا كان فيه خطأ في الحقول، ما نكملش
                  }

                  if (trimmedNote.length === 0) {
                    setNoteError("لا يمكن ارسال الملاحظة فارغة.");
                    return;
                  }
                  if (trimmedNote.length < 5) {
                    setNoteError("الملاحظة يجب أن تكون 5 أحرف على الأقل.");
                    return;
                  }

                  setNoteError(""); // Clear error on success

                  // إرسال الطلب الخاص إلى API
                  const success = await submitSpecialOrder();
                  
                  if (success) {
                    // حفظ في localStorage كما هو (للتوافق مع النظام القديم)
                    const notes = JSON.parse(
                      localStorage.getItem("cartNotes") || "{}"
                    );
                    notes[product.id] = note;
                    localStorage.setItem("cartNotes", JSON.stringify(notes));
                    
                    // تفريغ الحقول بعد الإرسال الناجح
                    setNote("");
                    setDimensions({
                      length: "",
                      width: "",
                      height: "",
                      size: "",
                      quantity: "",
                      phone: "",
                    });
                    setSelectedFile(null);
                    setFileError("");

                    // إغلاق النافذة بعد الحفظ
                    const modal = document.getElementById("noteModal");
                    if (modal) modal.style.display = "none";

                    // إظهار رسالة النجاح
                    setShowSuccessMessage(true);
                    // إخفاء الرسالة بعد 3 ثوانٍ
                    setTimeout(() => {
                      setShowSuccessMessage(false);
                    }, 3000);
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa fa-spinner fa-spin" style={{ marginLeft: "5px" }}></i>
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}