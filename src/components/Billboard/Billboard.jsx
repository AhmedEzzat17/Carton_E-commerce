import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';

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
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
              <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                <div className="banner-content">
                  <h2>كروت مميزة وتغليف أنيق لكل مناسبة</h2>
                  <p>خصم 30٪ لفترة محدودة – احصل عليه الآن!</p>
                  <a href="index.html" className="btn mt-3">الذهاب إلى المتجر</a>
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
                  <a href="index.html" className="btn mt-3">الذهاب إلى المتجر</a>
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
                  <a href="index.html" className="btn mt-3">الذهاب إلى المتجر</a>
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