import React, { useEffect } from "react";
import '../../assets/css/style.css';

export default function FAQSection() {
  useEffect(() => {
    const faqItems = document.querySelectorAll(
      ".faq-section-wrapper .faq-item"
    );

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      question.addEventListener("click", () => {
        item.classList.toggle("active");

        if (item.classList.contains("active")) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.style.maxHeight = "0";
        }

        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".faq-answer").style.maxHeight = "0";
          }
        });
      });
    });

    // التنظيف عند الخروج من الكومبوننت
    return () => {
      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.replaceWith(question.cloneNode(true));
      });
    };
  }, []);

  return (
    <section className="faq-section-wrapper" id="faq-section-wrapper">
      <div className="container">
        <div className="faq-content-wrapper">
          <div className="section-title d-md-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="d-flex align-items-center" data-aos="fade-down">الأسئلة الشائعة</h3>
              <div className="title-underline mx-auto" data-aos="fade-down"></div>
            </div>
          </div>

          {/* FAQ Items */}
          {[
            {
              question: "ما هي طريقة الطلب من الموقع؟",
              answer:
                "جميع الطلبات تتم عن طريق الموقع مباشرة اختر المنتج من الموقع ثم ادخل بياناتك واختر طريقة الدفع وقم بإتمام الطلب وسيكون الطلب في طريقه إليك.",
            },
            {
              question: "كم الوقت المستغرق في التوصيل؟",
              answer: (
                <>
                  يتم التوصيل عادةً خلال 2 - 5 أيام عمل ولتفاصيل اكثر يمكنك
                  زيارة صفحة تفاصيل مدة الشحن والتوصيل.{" "}
                  <a href="#">اضغط هنا لزيارة صفحة تفاصيل مدة الشحن والتوصيل</a>
                </>
              ),
            },
            {
              question: "ماهي طريقة الدفع؟",
              answer:
                "طرق دفع عن طريق التحويل البنكي وسيتوفر قريباً فيزا , ماستر كارد , أبل باى.",
            },
            {
              question: "ماهي سياسة الموقع و سياسة الاستبدال و الاسترجاع؟",
              answer: (
                <>
                  جميع التفاصيل في الرابط أدناه.{" "}
                  <a href="#">اضغط هنا للمزيد من التفاصيل</a>
                </>
              ),
            },
            {
              question: "ماهي المناطق التي توصلون إليها؟",
              answer:
                "نوصل إلى جميع مناطق [اسم البلد/المنطقة الخاصة بك] حالياً. نسعى لتوسيع خدماتنا لتشمل مناطق أكثر قريباً.",
            },
          ].map((item, index) => (
            <div className="faq-item" data-aos="fade-up" key={index}>
              <div className="faq-question">
                <h3>{item.question}</h3>
                <i className="fas fa-chevron-down arrow-icon"></i>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
