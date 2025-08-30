import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";
import ProductService from "../../services/interface/productService";
import { CartWishlistContext } from "../../App";
// دالة لحفظ ملاحظة المنتج في السلة داخل localStorage بشكل كائن
// الاستخدام: saveProductNote(productId, note)
function saveProductNote(productId, note) {
  const notes = JSON.parse(localStorage.getItem("cartNotes") || "{}");
  notes[productId] = note;
  localStorage.setItem("cartNotes", JSON.stringify(notes));
}
export default function RecentProducts() {
  const [products, setProducts] = useState([]);
  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";
  const {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
  } = useContext(CartWishlistContext);

  useEffect(() => {
    ProductService.get()
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.data?.data)) {
          const sorted = res.data.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setProducts(sorted.slice(0, 4)); // عرض آخر 4 منتجات فقط
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>لا توجد منتجات متاحة حالياً</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 one" id="one" data-aos="fade-down">
      <div className="row" data-aos="fade-down">
        {/* العنوان */}
        <div className="section-title text-center mb-5" data-aos="fade-up">
          <h2>ما نزل مؤخرًا</h2>
          <div className="title-underline mx-auto" data-aos="fade-down"></div>
        </div>

        {/* عرض المنتجات */}
        {products.map((product) => {
          const inCart = cartItems.some((item) => item.id === product.id);
          const inWishlist = wishlistItems.some(
            (item) => item.id === product.id
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
                      src={
                        product.images
                          ? `https://myappapi.fikriti.com/${product.images}`
                          : fallbackImage
                      }
                      alt={product.name}
                      onClick={() => window.scrollTo(0, 0)}
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
                    <button
                      type="button"
                      className="icon-btn"
                      title="Quick View"
                    >
                      <i className="fas fa-eye"></i>
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
        })}

        {/* زر عرض المزيد */}
        <Link to="/FullRecentProductsPage">
          <div
            className="text-center mt-4 mb-5"
            onClick={() => window.scrollTo(0, 0)}
            data-aos="fade-up"
          >
            <button className="btn btn-primary load-more-btn">
              <span className="btn-text">عرض المزيد</span>
              <i className="fas fa-arrow-right arrow-icon"></i>
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
