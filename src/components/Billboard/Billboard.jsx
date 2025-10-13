import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { gsap } from 'gsap';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import '../../assets/css/style.css';
import '../../assets/js/main.js';
import bannerBg1 from '../../assets/images/banner-image-bg-1.jpg';
import postalImg from '../../assets/images/postal-32383_1280.png';
import graphicImg from '../../assets/images/graphic-3578346_1280.png';
import packageImg from '../../assets/images/package-4256289_1280-removebg-preview.png';

export default function Billboard() {
  const swiperRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    // إعداد الانيميشن الأولي للنصوص
    gsap.set(textRefs.current, {
      x: 100,
      opacity: 0
    });

    // انيميشن ظهور النصوص عند تحميل المكون
    gsap.to(textRefs.current, {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.5
    });
  }, []);

  const handleSlideChange = (swiper) => {
    // الحصول على النصوص في الشريحة الحالية
    const currentSlide = swiper.slides[swiper.activeIndex];
    const currentTexts = currentSlide.querySelectorAll('.banner-content h2, .banner-content p');
    
    // إخفاء النصوص أولاً
    gsap.set(currentTexts, {
      x: 100,
      opacity: 0
    });

    // ثم إظهارها بانيميشن
    gsap.to(currentTexts, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.3
    });
  };

  return (
    <section
      id="billboard"
      className="position-relative d-flex align-items-center py-5 bg-light-gray"
      data-aos="fade-down"
      style={{
        backgroundImage: `url(${bannerBg1})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        // تم إزالة ارتفاع 'height: 600px' للسماح لـ CSS بالتحكم به بشكل كامل وتجاوبي
      }}
    >
      {/* <div className="position-absolute end-0 pe-0 pe-xxl-5 me-0 me-xxl-5 swiper-button-next">
        <svg
          className="chevron-forward-circle d-flex justify-content-center align-items-center p-2"
          width="80"
          height="80"
        >
          <use xlinkHref="#alt-arrow-right-outline"></use>
        </svg>
      </div>
      <div className="position-absolute start-0 ps-0 ps-xxl-5 ms-0 ms-xxl-5 swiper-button-prev">
        <svg
          className="chevron-back-circle d-flex justify-content-center align-items-center p-2"
          width="80"
          height="80"
        >
          <use xlinkHref="#alt-arrow-left-outline"></use>
        </svg>
      </div> */}

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay, EffectFade, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        effect={'fade'}
        fadeEffect={{
          crossFade: true,
        }}
        // pagination={{
        //   el: '.swiper-pagination',
        //   clickable: true,
        // }}
        loop={true}
        speed={800}
        className="main-swiper"
        onSlideChange={handleSlideChange}
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
              <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                <div className="banner-content">
                  <h2 ref={el => textRefs.current[0] = el}>كروت مميزة وتغليف أنيق لكل مناسبة</h2>
                  <p ref={el => textRefs.current[1] = el}>خصم 30٪ لفترة محدودة – احصل عليه الآن!</p>
                  <Link to="/FullRecentProductsPage">
                  <button className="btn mt-3">الذهاب إلى المتجر</button>
                  </Link>
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div className="image-holder">
                  <img
                    src={postalImg}
                    className="img-fluid"
                    alt="banner"
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
              <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                <div className="banner-content">
                  <h2>كروت وتغليف بتكمل فرحة مناسبتك</h2>
                  <p>خصم 30٪ لفترة محدودة – احصل عليه الآن!</p>
                  <Link to="/FullRecentProductsPage">
                  <button className="btn mt-3">الذهاب إلى المتجر</button>
                  </Link>
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div className="image-holder">
                  <img
                    src={graphicImg}
                    className="img-fluid"
                    alt="banner"
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
              <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                <div className="banner-content">
                  <h2>صمم لحظاتك بكروت وتغليف مميز</h2>
                  <p>خصم 30٪ لفترة محدودة – احصل عليه الآن!</p>
                  <Link to="/FullRecentProductsPage">
                  <button className="btn mt-3">الذهاب إلى المتجر</button>
                  </Link>
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div className="image-holder">
                  <img
                    src={packageImg}
                    className="img-fluid"
                    alt="banner"
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <div className="swiper-pagination"></div>
      </Swiper>
    </section>
  );
}