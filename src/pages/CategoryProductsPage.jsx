import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "../assets/css/style.css";
import categoryService from "../services/interface/categoryService";
import { CartWishlistContext } from "../App";

export default function CategoryProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
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
    categoryService
      .getById(id)
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.data?.products?.data)) {
          setCategory(res.data.data.category);
          const sorted = res.data.data.products.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setProducts(sorted);
        }
      })
      .catch((err) => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4>جارٍ التحميل...</h4>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>لا توجد منتجات متاحة لهذا القسم حالياً</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 one" id="one" data-aos="fade-down">
      <div className="row" data-aos="fade-down">
        <div className="section-title text-center mb-5" data-aos="fade-up">
          <h2>{category ? category.name : "منتجات القسم"}</h2>
          <div className="title-underline mx-auto" data-aos="fade-down"></div>
        </div>

        {products.map((product) => {
          const inCart = cartItems.some((item) => item.id === product.id);
          const inWishlist = wishlistItems.some(
            (item) => item.id === product.id
          );
          let imgSrc = fallbackImage;
          if (product.productimages?.[0]?.url) {
            imgSrc = product.productimages[0].url;
          } else if (product.main_image) {
            imgSrc = product.main_image;
          }
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
                      src={imgSrc}
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
      </div>
    </div>
  );
}
