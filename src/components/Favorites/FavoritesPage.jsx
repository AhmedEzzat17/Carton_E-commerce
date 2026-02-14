import React, { useContext, useEffect } from "react";
import { CartWishlistContext } from "../../App";
import "../../assets/css/style.css";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  useEffect(() => {
    document.title = "المفضلات";
  }, []);

  const {
    wishlistItems,
    cartItems,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
  } = useContext(CartWishlistContext);
  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="container py-5 one" id="favorites" data-aos="fade-down">
      <div className="row" data-aos="fade-down">
        <div className="section-title text-center mb-5" data-aos="fade-up">
          <h2>المفضلات</h2>
          <div className="title-underline mx-auto" data-aos="fade-down"></div>
        </div>
        {wishlistItems.length === 0 ? (
          <div className="empty-favorites text-center py-5">
            <h4>لا توجد منتجات في المفضلة حاليا.</h4>
          </div>
        ) : (
          wishlistItems.map((product) => {
            const inCart = cartItems.some((item) => item.id === product.id);
            const inWishlist = wishlistItems.some(
              (item) => item.id === product.id,
            );
            return (
              <div key={product.id} className="col-md-3 col-sm-6 mb-4 z-0">
                <div className="product-card">
                  {Number(product.compare_price) < Number(product.price) ? (
                    <span className="badge-sale">تخفيض</span>
                  ) : (
                    <span className="badge-new">جديد</span>
                  )}
                  <div className="img-container">
                    <Link to={`/productPage/${product.id}`}>
                      <img
                        src={(() => {
                          // نظام شامل لعرض الصور مثل MostDemandedProducts
                          if (product.main_image) {
                            return product.main_image;
                          } else if (
                            Array.isArray(product.images) &&
                            product.images.length > 0
                          ) {
                            // لو images Array وفيها full_url
                            return product.images[0]?.full_url || fallbackImage;
                          } else if (
                            typeof product.images === "string" &&
                            product.images
                          ) {
                            // لو images string (مثل RecentProducts)
                            return `https://myappapi.fikriti.com/${product.images}`;
                          }
                          return fallbackImage;
                        })()}
                        alt={product.name}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        loading="lazy"
                      />
                    </Link>
                    <div className="hover-icons">
                      <button
                        type="button"
                        className={`icon-btn${
                          inWishlist ? " active-wishlist" : ""
                        }`}
                        title={
                          inWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"
                        }
                        style={
                          inWishlist
                            ? {
                                background: "#407c7c",
                                color: "#fff",
                                border: "none",
                              }
                            : {
                                background: "#fff",
                                color: "#407c7c",
                                border: "none",
                              }
                        }
                        onClick={() =>
                          inWishlist
                            ? removeFromWishlist(product)
                            : addToWishlist(product)
                        }
                      >
                        <i className="far fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="product-title">{product.name}</h5>
                    <div className="star-rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="far fa-star"></i>
                      <span style={{ fontSize: "0.8em", color: "#777" }}>
                        (42)
                      </span>
                    </div>
                    <div className="price">
                      {product.price} ر.س{" "}
                      {product.compare_price && (
                        <span className="old-price">
                          {product.compare_price} ر.س
                        </span>
                      )}
                    </div>
                    {inCart ? (
                      <button
                        className="btn btn-danger add-to-cart-btn"
                        onClick={() => removeFromCart(product)}
                      >
                        إزالة من السلة
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <i className="fas fa-shopping-cart"></i> إضافة للسلة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
