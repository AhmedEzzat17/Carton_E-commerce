import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { CartWishlistContext } from "../../App";
import "../../assets/css/style.css";

const fallbackImage = "https://via.placeholder.com/600x600?text=No+Image";

export default function MostDemandedProducts({ category }) {
  const [title, setTitle] = useState(category?.name || "...");
  const [products, setProducts] = useState([]);
  const {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
  } = useContext(CartWishlistContext);

  useEffect(() => {
    // Bootstrap tooltip init
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  useEffect(() => {
    if (!category) return;
    setTitle(category.name || "قسم");
    // المنتجات: لو فيه products Array (حتى لو products_count غير موجود)
    let items = [];
    if (Array.isArray(category.products)) {
      items = category.products;
    }
    // ترتيب المنتجات بالأحدث
    const sorted = [...items].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setProducts(sorted.slice(0, 4));
  }, [category]);

  if (!category) {
    return null;
  }

  // لو فيه products_count > 0 وproducts ليست Array أو undefined، فقط وقتها تظهر رسالة الخطأ
  if (
    category.products_count > 0 &&
    (!category.products || !Array.isArray(category.products))
  ) {
    return (
      <section className="position-relative py-5">
        <div className="container">
          <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="d-flex align-items-center" data-aos="fade-down">
                {title}
              </h3>
              <div
                className="title-underline mx-auto"
                data-aos="fade-down"
              ></div>
            </div>
            <Link
              to={`/category/${category.id}`}
              className="btn"
              data-aos="fade-down"
            >
              <span>عرض الكل</span>
            </Link>
          </div>
          <div className="alert alert-danger">
            هناك مشكلة في جلب المنتجات لهذا القسم، تحقق من الـ API.
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="position-relative py-5">
        <div className="container">
          <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="d-flex align-items-center" data-aos="fade-down">
                {title}
              </h3>
              <div
                className="title-underline mx-auto"
                data-aos="fade-down"
              ></div>
            </div>
            <Link
              to={`/category/${category.id}`}
              className="btn"
              data-aos="fade-down"
            >
              <span>عرض الكل</span>
            </Link>
          </div>
          <div className="alert alert-warning">
            لا توجد منتجات متاحة لهذا القسم حالياً.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={`category-${category.id}`} className="position-relative py-5">
      {/* SVG Sprite */}
      <svg style={{ display: "none" }}>
        <symbol id="cart" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
             0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.2 
             12l.94-2h8.17c.75 0 1.41-.41 1.75-1.03l3.58-6.49a.996.996 0 
             10-1.74-.96L16.42 8H8.53l-1.1-2H2v2h3.6l1.86 4-1.35 2.44C5.16 
             15.28 6.48 18 8.5 18h11v-2H8.42c-.14 0-.25-.11-.25-.25 0-.04.01-.08.02-.11L7.2 12z"
          />
        </symbol>
        <symbol id="heart" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 
             2.09C13.09 4.01 14.76 3 16.5 3 
             19.58 3 22 5.42 22 8.5c0 3.78-3.4 
             6.86-8.55 11.54L12 21.35z"
          />
        </symbol>
      </svg>

      <div className="container">
        <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="d-flex align-items-center" data-aos="fade-down">
              {title}
            </h3>
            <div className="title-underline mx-auto" data-aos="fade-down"></div>
          </div>
          <Link
            to={`/category/${category.id}`}
            className="btn"
            data-aos="fade-down"
          >
            <span>عرض الكل</span>
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          data-aos="fade-up"
          navigation={{
            nextEl: ".product-slider-button-next",
            prevEl: ".product-slider-button-prev",
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            660: { slidesPerView: 3 },
            980: { slidesPerView: 4 },
            1500: { slidesPerView: 5 },
          }}
          className="product-swiper"
        >
          {products.map((product) => {
            // منطق الصورة شامل كل الحالات
            let imgSrc = fallbackImage;
            if (product.main_image) {
              imgSrc = product.main_image;
            } else if (
              Array.isArray(product.images) &&
              product.images.length > 0
            ) {
              // لو images Array وفيها full_url
              imgSrc = product.images[0]?.full_url || fallbackImage;
            } else if (typeof product.images === "string" && product.images) {
              // لو images string (مثل RecentProducts)
              imgSrc = `https://myappapi.fikriti.com/${product.images}`;
            }
            const inCart = cartItems.some((item) => item.id === product.id);
            const inWishlist = wishlistItems.some(
              (item) => item.id === product.id
            );
            return (
              <SwiperSlide key={product.id}>
                <div className="card position-relative border rounded-3 p-4">
                  {/* بادج تخفيض/جديد */}
                  {Number(product.compare_price) < Number(product.price) ? (
                    <div className="position-absolute">
                      <p
                        className="py-1 px-3 fs-6 text-white rounded-2"
                        style={{ backgroundColor: "#407c7c" }}
                      >
                        تخفيض
                      </p>
                    </div>
                  ) : (
                    <div className="position-absolute">
                      <p
                        className=" py-1 px-3 fs-6 text-white rounded-2"
                        style={{ backgroundColor: "#407c7c" }}
                      >
                        جديد
                      </p>
                    </div>
                  )}

                  <Link to={`/productPage/${product.id}`}>
                    <img
                      src={imgSrc}
                      className="img-fluid shadow-sm"
                      alt={product.name}
                      onClick={() => window.scrollTo(0, 0)}
                      loading="lazy"
                    />
                  </Link>

                  <h6 className="mt-4 mb-0 fw-bold">
                    <Link
                      to={`/productPage/${product.id}`}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      {product.name}
                    </Link>
                  </h6>

                  <div className="review-content d-flex"></div>

                  <span className="price text-primary fw-bold mb-2 mt-3 fs-5">
                    {product.price} ر.س{" "}
                    {product.compare_price && (
                      <small className="text-dark text-decoration-line-through ms-2">
                        {product.compare_price} ر.س
                      </small>
                    )}
                  </span>

                  <div className="card-concern position-absolute start-0 end-0 d-flex gap-2">
                    {inCart ? (
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="إزالة من السلة"
                        onClick={() => removeFromCart(product)}
                      >
                        <svg className="cart">
                          <use xlinkHref="#cart"></use>
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-dark"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="إضافة للسلة"
                        onClick={() => addToCart(product)}
                      >
                        <svg className="cart">
                          <use xlinkHref="#cart"></use>
                        </svg>
                      </button>
                    )}

                    <button
                      type="button"
                      className={`btn${
                        inWishlist ? " btn-success" : " btn-dark"
                      }`}
                      data-bs-toggle="tooltip"
                      data-bs-title={
                        inWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"
                      }
                      onClick={() =>
                        inWishlist
                          ? removeFromWishlist(product)
                          : addToWishlist(product)
                      }
                    >
                      <svg className="wishlist">
                        <use xlinkHref="#heart"></use>
                      </svg>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
