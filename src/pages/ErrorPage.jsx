import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - الصفحة غير موجودة";
  }, []);

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.href = "/";
    //navigate('/');
  };

  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--primary-color)"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="9"
              x2="9"
              y2="15"
              stroke="var(--primary-color)"
              strokeWidth="2"
            />
            <line
              x1="9"
              y1="9"
              x2="15"
              y2="15"
              stroke="var(--primary-color)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="error-text">
          <h1 className="error-title">404</h1>
          <h2 className="error-subtitle">عذراً، الصفحة غير موجودة</h2>
          <p className="error-description">
            لا يمكننا العثور على الصفحة التي تبحث عنها. قد تكون قد حُذفت أو
            نُقلت أو أن الرابط غير صحيح.
          </p>
        </div>

        <div className="error-actions">
          <button onClick={handleGoHome} className="home-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="9,22 9,12 15,12 15,22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            العودة للصفحة الرئيسية
          </button>

          <button onClick={() => window.history.back()} className="back-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline
                points="15,18 9,12 15,6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            العودة للخلف
          </button>
        </div>

        <div className="error-suggestions">
          <h3>يمكنك :</h3>
          <ul>
            <li>التحقق من صحة الرابط المكتوب</li>
            <li>استخدام شريط البحث للعثور على ما تبحث عنه</li>
            <li>التواصل معنا إذا كنت تواجه مشكلة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
