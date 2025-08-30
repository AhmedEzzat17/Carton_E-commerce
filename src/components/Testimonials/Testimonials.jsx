import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import '../../assets/css/style.css';
import misaImg from '../../assets/images/misa-1320x1320.jpg';
import avatarFemale from '../../assets/images/avatar_female.webp';

export default function Testimonials() {
  return (
    <section className="testimonials-section container mb-4" id="testimonials">
      <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="d-flex align-items-center px-1" data-aos="fade-down">آراء العملاء </h3>
          <div className="title-underline mx-auto" data-aos="fade-down"></div>
        </div>
      </div>
      <div className="section-content" data-aos="fade-down">
        <div className="slider-container">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            slidesPerView={3} // ✅ عرض 3 عناصر
            spaceBetween={20}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".testimonial-button-next",
              prevEl: ".testimonial-button-prev",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
            }}
            className="slider-wrapper py-3"
          >
            {/* Testimonial Slides */}
            {[
              {
                name: "أحمد المحمدي",
                image: misaImg,
                text:
                  "تجربة رائعة! المنتجات ذات جودة عالية وخدمة العملاء سريعة ومتعاونة للغاية. أنصح بالتعامل معهم بشدة.",
              },
              {
                name: "فاطمة الزهراء",
                image: avatarFemale,
                text:
                  "أنا سعيدة جداً بالمنتج الذي اشتريته. وصل في وقت قياسي والتغليف كان ممتازاً. بالتأكيد سأعود للشراء مرة أخرى.",
              },
              {
                name: "يوسف علي",
                image: misaImg,
                text:
                  "من أفضل المتاجر الإلكترونية التي تعاملت معها. سهولة في التصفح وسرعة في التوصيل. شكراً لكم على الاحترافية.",
              },
              {
                name: "مريم خالد",
                image: avatarFemale,
                text:
                  "جودة لا مثيل لها وسعر مناسب. فريق الدعم الفني كان متعاوناً جداً في الإجابة على استفساراتي. تجربة تسوق ممتعة.",
              },
              {
                name: "علياء حسين",
                image: avatarFemale,
                text:
                  "أعجبني جداً تنوع المنتجات الموجودة. وجدت كل ما أحتاجه بسهولة. التوصيل كان سريعاً وموثوقاً به.",
              },
              {
                name: "خالد محمود",
                image: misaImg,
                text:
                  "خدمة عملاء ممتازة! واجهت مشكلة بسيطة وتم حلها بسرعة واحترافية. هذا ما يميز المتجر حقاً.",
              },
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <li className="testimonial swiper-slide">
                  <i className="quote-icon fas fa-quote-right" data-aos="fade-down"></i>
                  <blockquote>{item.text}</blockquote>
                  <div className="client-info" data-aos="fade-down">
                    <img
                      src={item.image}
                      alt={`صورة العميل ${item.name}`}
                      className={`client-image ${
                        item.image.includes("female") ? "female-image" : "male-image"
                      }`}
                    />
                    <h3 className="name text-uppercase">{item.name}</h3>
                  </div>
                </li>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
}
