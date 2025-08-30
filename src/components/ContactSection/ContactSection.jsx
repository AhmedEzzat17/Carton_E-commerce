import React from "react";
// تأكد من أن مسار ملف style.css صحيح إذا كان يحتوي على أنماط إضافية لهذا القسم
import '../../assets/css/style.css';
// قد تحتاج إلى استيراد أنماط Bootstrap Icons إذا لم تكن مستوردة بالفعل في App.js
// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ContactSection() {
  return (
    <section id="contact-2" className="contact-2 section py-5">
      <div className="container" data-aos="fade-up">
        {/* معلومات التواصل */}
        <div className="row g-4 mb-2" data-aos="fade-up">
          <div className="col-md-6">
            <div className="contact-info-card">
              <div className="icon-box">
                <i className="bi bi-geo-alt"></i>
              </div>
              <div className="info-content" data-aos="fade-down">
                <h4>العنوان</h4>
                <p> شارع او حي </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="contact-info-card">
              <div className="icon-box">
                <i className="bi bi-telephone"></i>
              </div>
              <div className="info-content" data-aos="fade-down">
                <h4>الهاتف و البريد الإلكتروني</h4>
                <p>+000000000</p>
                <p>connect@example.com</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="row justify-content-center mb-5"
          data-aos="fade-up"
        >
          <div className="col-lg-10">
            <div className="contact-form-wrapper">
              <div className="text-center mb-5">
                <h2 className="text-center mb-1" data-aos="fade-down">تواصل معنا</h2>
                <div className="title-underline mx-auto" data-aos="fade-down"></div>
              </div>

              <form
                action="forms/contact.php"
                method="post"
                className="php-email-form"
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="الاسم الكامل"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="البريد الإلكتروني"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        placeholder="الموضوع"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name="message"
                        placeholder="اكتب رسالتك هنا..."
                        rows="6"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12 text-center"data-aos="fade-up">
                    <button type="submit" className="btn-submit">
                      إرسال الرسالة
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
