import React, { useEffect, useState, useContext } from "react";
import "../../assets/css/product.css";
import { CartWishlistContext } from "../../App";
import { useNavigate } from "react-router-dom";

export default function ProductDetails({ product }) {
  const [mainImage, setMainImage] = useState("");
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
            تم إرسال الملاحظة بنجاح
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
                  fontSize: "16px",
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
                إضغط هنا حتى يمكنك كتابة ملاحظة للبائع تخص الطلب، مثل نوع تريد
                تذكيره به، طلب معين، طريقة التوصيل.
              </div>
            ) : (
              <div
                style={{
                  marginTop: "10px",
                  background: "#fa0f0fff",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                لإضافه ملاحظه للبائع تخص الطلب، مثل نوع تريد تذكيره به، طلب معين، طريقة التوصيل،أضف المنتج إلى السلة أولاً
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
              padding: "30px 20px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              textAlign: "right",
              position: "relative",
              animation: "fadeInUp 0.3s ease-in-out",
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

            <h3 style={{ marginBottom: "15px" }}>أضف ملاحظتك</h3>
            <textarea
              placeholder="أضف ملاحظتك هنا"
              rows="5"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (e.target.value.trim().length >= 5) {
                  setNoteError("");
                }
              }}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: `1px solid ${noteError ? "red" : "#ccc"}`,
                padding: "10px",
                fontFamily: "inherit",
                fontSize: "15px",
                resize: "none",
              }}
            ></textarea>
            {noteError && (
              <p style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
                {noteError}
              </p>
            )}
            <button
              className="review"
              style={{
                marginTop: "15px",
                background: "var(--primary-color)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
              }}
              onClick={() => {
                const trimmedNote = note.trim();
                if (trimmedNote.length === 0) {
                  setNoteError("لا يمكن ارسال الملاحظة فارغة.");
                  return;
                }
                if (trimmedNote.length < 5) {
                  setNoteError("الملاحظة يجب أن تكون 5 أحرف على الأقل.");
                  return;
                }
                setNoteError(""); // Clear error on success
                const notes = JSON.parse(
                  localStorage.getItem("cartNotes") || "{}"
                );
                notes[product.id] = note;
                localStorage.setItem("cartNotes", JSON.stringify(notes));
                setNote(""); // تفريغ حقل الملاحظة بعد الإرسال
                // إغلاق النافذة بعد الحفظ
                const modal = document.getElementById("noteModal");
                if (modal) modal.style.display = "none";
                // إظهار رسالة النجاح
                setShowSuccessMessage(true);
                // إخفاء الرسالة بعد 3 ثوانٍ
                setTimeout(() => {
                  setShowSuccessMessage(false);
                }, 3000);
              }}
            >
              إرسال الملاحظة
            </button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
