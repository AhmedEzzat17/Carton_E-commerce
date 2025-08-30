import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";
import categoryService from "../../services/interface/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // طلب البيانات بدون توكن
    categoryService
      .get({ withAuth: false })
      .then((res) => {
        if (res.data?.status) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });

    // اسكرول بالماوس
    const scrollContainer = document.querySelector(
      ".category-scroll-container"
    );
    let isDown = false;
    let startX;
    let scrollLeft;

    if (!scrollContainer) return;

    const mouseDownHandler = (e) => {
      isDown = true;
      scrollContainer.classList.add("active");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const mouseUpHandler = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", mouseDownHandler);
    scrollContainer.addEventListener("mouseleave", mouseLeaveHandler);
    scrollContainer.addEventListener("mouseup", mouseUpHandler);
    scrollContainer.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      scrollContainer.removeEventListener("mousedown", mouseDownHandler);
      scrollContainer.removeEventListener("mouseleave", mouseLeaveHandler);
      scrollContainer.removeEventListener("mouseup", mouseUpHandler);
      scrollContainer.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <section
      className="categories-section"
      id="categories"
      data-aos="fade-down"
    >
      <div className="container">
        <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="d-flex align-items-center" data-aos="fade-down">
              الأقسام
            </h3>
            <div className="title-underline mx-auto" data-aos="fade-down"></div>
          </div>
        </div>

        <div className="category-gallery-sidebar" data-aos="fade-up">
          <div className="category-scroll-container" data-aos="fade-up">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="category-thumbnail-item category-item">
                  <div className="category-icon-wrapper">
                    <img src={cat.image_url} alt={cat.name} />
                  </div>
                  <h4>{cat.name}</h4>
                  <p>{cat.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
