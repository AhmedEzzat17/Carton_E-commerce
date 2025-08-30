import React from "react";
// تأكد من أن مسار ملف style.css صحيح إذا كان يحتوي على أنماط إضافية لهذا القسم
import '../../assets/css/style.css';
// قد تحتاج إلى استيراد أنماط Bootstrap Icons إذا لم تكن مستوردة بالفعل في App.js
// import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImg from '../../assets/images/resize_image_686fe7da13ce4.png';

export default function Footer() {
  return (
    <footer id="footer" className="footer accent-background">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-5 col-md-12 footer-about" data-aos="fade-down">
            <a href="index.html" className="logo d-flex align-items-center">
              {/* <span className="sitename">logo or text</span> */}
              <img
                className="sitename"
                src={logoImg}
                alt=""
              />
            </a>
            <p>
              نحن شركة متخصصة في توفير كافة مستلزمات التعبئة والتغليف، من
              الإكسسوارات والأكياس إلى تغليف الملابس والعطور، بالإضافة لمستلزمات
              الأطعمة والمشروبات – نوفر لك كل ما تحتاجه بجودة عالية واسعار
              مناسبة.
            </p>
            <div className="social-links d-flex mt-4">
              <a href="">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="">
                <i className="bi bi-telegram"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-6 footer-links" data-aos="fade-down">
            <h4>روابط مفيدة</h4>
            <ul>
              <li>
                <a href="#">الرئيسية</a>
              </li>
              <li>
                <a href="#one">ما نزل مؤخراً</a>
              </li>
              <li>
                <a href="#categories">الأقسام</a>
              </li>
              <li>
                <a href="#faq-section-wrapper">الأسئلة الشائعة</a>
              </li>
              {/* <li>
                <a href="#best-selling-items">المستلزمات</a>
              </li>
              <li>
                <a href="#contact-2">تواصل معنا</a>
              </li> */}
            </ul>
          </div>

          <div className="col-lg-2 col-6 footer-links" data-aos="fade-down">
            <h4>خدماتنا</h4>
            <ul>
              <li>
                <a href="./category/6">أكياس ورقية</a>
              </li>
              <li>
                <a href="./category/7">صناديق كرتون</a>
              </li>
              <li>
                <a href="./category/8">كرتون للتغليف</a>
              </li>
              <li>
                <a href="./category/9">مستلزمات تغليف الملابس</a>
              </li>
              {/* <li>
                <a href="#">مستلزمات الأطعمة والمشروبات</a>
              </li>
              <li>
                <a href="#">مستلزمات العطور</a>
              </li> */}
            </ul>
          </div>

          <div className="col-lg-3 col-md-12 footer-contact text-center text-md-end" data-aos="fade-down">
            <h4>تواصل معنا</h4>
            <p>شارع المعز</p>
            <p>القاهره</p>
            <p>مصر</p>
            <p className="mt-4">
              <strong>الهاتف:</strong> <span>+00000000</span>
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> <span>info@example.com</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4" data-aos="fade-up">
        <p>
          © <span>حقوق النشر</span>{" "}
          <strong
            className="px-1 sitename"
            onClick={() => window.open("https://www.fikriti.com/", "_blank")}
          >
            fikriti Team
          </strong>{" "}
          <span>جميع الحقوق محفوظة</span>
        </p>
        <div className="credits">
          التصميم بواسطة{" "}
          <a href="https://www.fikriti.com/" target="_blank">
            fikriti.com
          </a>
        </div>
      </div>
    </footer>
  );
}
