import React, { useContext, useState } from "react";
import { CartWishlistContext } from "../App";

const WishListSection = () => {
  const { wishlistItems, removeFromWishlist, updateCartQuantity, addToCart } =
    useContext(CartWishlistContext);

  const [showSuccess, setShowSuccess] = useState(false);
  // دالة لنقل جميع العناصر من المفضلة إلى السلة
  const moveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item);
      removeFromWishlist(item);
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  // دالة تحديث الكمية
  const updateQuantity = (id, newQuantity) => {
    updateCartQuantity(id, newQuantity);
  };

  // دالة حذف عنصر من المفضلة
  const removeItem = (id) => {
    const item = wishlistItems.find((i) => i.id === id);
    if (item) removeFromWishlist(item);
  };

  // حساب الإجمالي
  const subtotal = wishlistItems.reduce(
    (acc, item) =>
      acc + (item.unitPrice || item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <section id="wishlist-section" className="zelcashop-cart-section" dir="rtl">
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 999999,
            background: "#d4edda",
            color: "#317040ff",
            padding: "16px 32px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontWeight: "bold",
            fontSize: "1.1rem",
            minWidth: "220px",
            textAlign: "center",
          }}
        >
          تم نقل جميع العناصر الى صفحه السلة
        </div>
      )}
      <div className="zelcashop-cart-container">
        <div className="zelcashop-cart-header">
          <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="d-flex align-items-center" data-aos="fade-up">
                قائمة رغباتك
              </h2>
              <div className="title-underline mx-auto" data-aos="fade-up"></div>
            </div>
          </div>
          <a href="/" className="zelcashop-back-link" data-aos="fade-up">
            <i className="fas fa-arrow-right"></i> الرئيسية
          </a>
        </div>
        <div className="zelcashop-cart-content">
          <div className="zelcashop-cart-items-wrapper" data-aos="fade-down">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-5">
                <h4>لا توجد منتجات في المفضلة</h4>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="zelcashop-cart-item"
                  data-unit-price={item.unitPrice || item.price || 0}
                >
                  <div className="zelcashop-item-details">
                    <img
                      src={
                        item.image ||
                        item.main_image ||
                        (Array.isArray(item.images) &&
                          item.images[0]?.full_url) ||
                        (typeof item.images === "string"
                          ? `https://myappapi.fikriti.com/${item.images}`
                          : "https://via.placeholder.com/60x60?text=No+Image")
                      }
                      alt={item.name}
                      className="zelcashop-item-image"
                    />
                    <div className="zelcashop-item-info">
                      <h3 className="zelcashop-item-name">{item.name}</h3>
                      <p className="zelcashop-item-price-unit">
                        {(typeof item.unitPrice === "number"
                          ? item.unitPrice
                          : typeof item.price === "number"
                          ? item.price
                          : parseFloat(item.unitPrice) ||
                            parseFloat(item.price) ||
                            0
                        ).toFixed(2)}{" "}
                        ر.س
                      </p>
                    </div>
                  </div>
                  <div className="zelcashop-item-actions">
                    <div className="zelcashop-quantity-control">
                      <button
                        className="zelcashop-quantity-btn zelcashop-decrease-qty"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="zelcashop-item-quantity">
                        {item.quantity || 1}
                      </span>
                      <button
                        className="zelcashop-quantity-btn zelcashop-increase-qty"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="zelcashop-item-total">
                      <p className="zelcashop-item-total-price">
                        {(
                          (typeof item.unitPrice === "number"
                            ? item.unitPrice
                            : typeof item.price === "number"
                            ? item.price
                            : parseFloat(item.unitPrice) ||
                              parseFloat(item.price) ||
                              0) * (item.quantity || 1)
                        ).toFixed(2)}{" "}
                        ر.س
                      </p>
                    </div>
                    <button
                      className="zelcashop-remove-item"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  {/* خيارات المنتج إذا أردت تفعيلها من السياق أضفها هنا */}
                </div>
              ))
            )}
          </div>
          <div className="zelcashop-cart-summary-section" data-aos="fade-up">
            <div className="zelcashop-summary-box">
              <h3>ملخص الطلب</h3>
              <div className="zelcashop-summary-line">
                <span>مجموع المنتجات</span>
                <span className="zelcashop-subtotal-price">
                  {subtotal.toFixed(2)} ر.س
                </span>
              </div>
              <div className="zelcashop-coupon-section">
                <h4>هل لديك كود خصم؟</h4>
                <div className="zelcashop-coupon-input-group">
                  <input
                    type="text"
                    placeholder="ادخل كود الخصم"
                    className="zelcashop-coupon-input"
                  />
                  <button className="zelcashop-apply-coupon-btn">إضافة</button>
                </div>
              </div>
              <div className="zelcashop-summary-line zelcashop-total-line">
                <span>الإجمالي</span>
                <span className="zelcashop-final-total-price">
                  {subtotal.toFixed(2)} ر.س
                </span>
              </div>
              <button
                className="zelcashop-checkout-btn"
                onClick={moveAllToCart}
              >
                النقل الى سلة التسوق لإتمام الطلبات
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishListSection;
