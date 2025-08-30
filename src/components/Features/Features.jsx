import React from "react";
// تأكد من أن مسار ملف style.css صحيح إذا كان يحتوي على أنماط إضافية لهذا القسم
import '../../assets/css/style.css';
import loyalCustomer from '../../assets/images/loyal-customer.png';
import passionate from '../../assets/images/passionate.png';
import relationship from '../../assets/images/relationship.png';
import badge from '../../assets/images/badge.png';

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="d-flex align-items-center" data-aos="fade-down">ما نتميز به</h3>
            <div className="title-underline mx-auto" data-aos="fade-down"></div>
          </div>
        </div>
        <div className="row features-grid g-4 justify-content-center">
          {/* Feature Item 1 */}
          <div className="col-sm-6 col-md-4 col-lg-3" data-aos="fade-down">
            <div className="feature-item">
              <div className="feature-icon">
                <img src={loyalCustomer} alt="برامج الولاء" />
              </div>
              <h4>الولاء فى المعاملة</h4>
              <p>
                كعميل في متجرنا، ستستفيد من برامج الولاء الجذابة والتخفيضات
                الحصرية.
              </p>
            </div>
          </div>

          {/* Feature Item 2 */}
          <div className="col-sm-6 col-md-4 col-lg-3" data-aos="fade-up">
            <div className="feature-item">
              <div className="feature-icon text-center">
                <img src={passionate} alt="شغفنا" />
              </div>
              <h4>شغفنا</h4>
              <p>
                نحن دائماً نسعى للتطوير ومواكبة العصر وتقديم كل ما هو جديد ونسعد
                بانضمامكم كاحد افراد اسرتنا.
              </p>
            </div>
          </div>

          {/* Feature Item 3 */}
          <div className="col-sm-6 col-md-4 col-lg-3" data-aos="fade-down">
            <div className="feature-item">
              <div className="feature-icon">
                <img src={relationship} alt="علاقتنا بعملائنا" />
              </div>
              <h4>علاقتنا بعملائنا</h4>
              <p>
                نحن نعتبر عملاؤنا من ضمن أفراد أسرة لنا و نحرص على متابعة و
                إتمام كافة الطلبات بدقة عالية.
              </p>
            </div>
          </div>

          {/* Feature Item 4 */}
          <div className="col-sm-6 col-md-4 col-lg-3" data-aos="fade-up">
            <div className="feature-item">
              <div className="feature-icon">
                <img src={badge} alt="الجودة العالية" />
              </div>
              <h4>الجودة العالية</h4>
              <p>
                نحن نحرص على الجودة ونهتم بأدق التفاصيل للحفاظ على الجودة و
                أسعار تنافسية تناسب الجميع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
