import React, { useContext, useEffect } from "react";
import { CartWishlistContext } from "../App";
import { Link } from "react-router-dom";

const ShoppingCartSection = () => {
  useEffect(() => {
    document.title = "سلة التسوق";
  }, []);

  const {
    cartItems,
    removeFromCart,
    updateCartQuantity, // يجب أن تكون معرفة في السياق
  } = useContext(CartWishlistContext);

  // إذا عندك دالة لتغيير الكمية في السياق، استخدمها هنا
  // مثال:
  // const updateQuantity = (product, delta) => {
  //   updateCartQuantity(product, delta);
  // };

  // دالة تساعد على جلب السعر كرقم
  const getPrice = (item) => {
    let price = item.price ?? item.unitPrice ?? 0;
    if (typeof price === "string") price = parseFloat(price);
    if (isNaN(price)) price = 0;
    return price;
  };
  const subtotal = cartItems.reduce(
    (acc, item) => acc + getPrice(item) * (item.quantity || 1),
    0,
  );

  return (
    <section
      id="shopping-cart-section"
      className="zelcashop-cart-section"
      dir="rtl"
    >
      <div className="zelcashop-cart-container">
        <div className="zelcashop-cart-header">
          <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="d-flex align-items-center" data-aos="fade-up">
                سلة التسوق
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
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <h4>لا توجد منتجات في السلة</h4>
              </div>
            ) : (
              cartItems.map((item) => {
                const price = getPrice(item);
                return (
                  <div
                    key={item.id}
                    className="zelcashop-cart-item"
                    data-unit-price={price}
                  >
                    <div className="zelcashop-item-details">
                      <img
                        src={
                          item.main_image ||
                          item.image ||
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
                          {price.toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>
                    <div className="zelcashop-item-actions">
                      <div className="zelcashop-quantity-control">
                        <button
                          className="zelcashop-quantity-btn zelcashop-decrease-qty"
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              (item.quantity || 1) - 1,
                            )
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
                            updateCartQuantity(
                              item.id,
                              (item.quantity || 1) + 1,
                            )
                          }
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="zelcashop-item-total">
                        <p className="zelcashop-item-total-price">
                          {(price * (item.quantity || 1)).toFixed(2)} ر.س
                        </p>
                      </div>
                      <button
                        className="zelcashop-remove-item"
                        onClick={() => removeFromCart(item)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    {/* إذا عندك خيارات للمنتج أضفها هنا */}
                    {/* <div className="zelcashop-item-options">
                      <select
                        className="zelcashop-item-option-select"
                        value={item.selectedOption}
                        onChange={(e) => handleOptionChange(item, e.target.value)}
                      >
                        {item.options && item.options.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div> */}
                  </div>
                );
              })
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
              {/* <div className="zelcashop-coupon-section">
                <h4>هل لديك كود خصم؟</h4>
                <div className="zelcashop-coupon-input-group">
                  <input
                    type="text"
                    placeholder="ادخل كود الخصم"
                    className="zelcashop-coupon-input"
                  />
                  <button className="zelcashop-apply-coupon-btn">إضافة</button>
                </div>
              </div> */}
              <div className="zelcashop-summary-line zelcashop-total-line">
                <span>الإجمالي</span>
                <span className="zelcashop-final-total-price">
                  {subtotal.toFixed(2)} ر.س
                </span>
              </div>
              <Link
                to="/PaymentmMethod"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <button className="zelcashop-checkout-btn">اتمام الطلب</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCartSection;
