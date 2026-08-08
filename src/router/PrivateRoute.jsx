import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { decryptData } from "../utils/encryption";

const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    // فك تشفير الدور لو موجود
    if (parsed.role) {
      parsed.role = decryptData(parsed.role);
    }
    if (parsed.user?.role) {
      parsed.user.role = decryptData(parsed.user.role);
    }
    return parsed;
  } catch {
    return null;
  }
};

const PrivateRoute = ({ allowedRoles }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const token = user?.token;
  let role = user?.role || user?.user?.role;

  // دعم تمثيل الدور كرقم أو نص
  if (role === 1 || role === "1" || role === "admin") {
    role = "admin";
  } else if (role === 0 || role === "0" || role === "user") {
    role = "user";
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  // إذا لم يكن مسجل دخول، أظهر النافذة المنبثقة
  if (!token) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* النافذة المنبثقة لتسجيل الدخول */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              navigate('/');
            }
          }}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(64, 124, 124, 0.15)',
              maxWidth: '450px',
              width: '90%',
              margin: '20px',
              position: 'relative',
              animation: 'slideUp 0.4s ease-out',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #5FA9A9 0%, #407C7C 100%)',
              padding: '30px 25px 25px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
                <i className="bx bx-lock-alt" style={{ fontSize: '32px', color: 'white' }}></i>
              </div>
              <button 
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => navigate('/')}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <i className="bx bx-x" style={{ fontSize: '20px', color: 'white' }}></i>
              </button>
            </div>
            
            {/* Body */}
            <div style={{
              padding: '35px 30px',
              textAlign: 'center'
            }}>
              <h3 style={{
                color: 'red',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '15px',
                fontFamily: 'Cairo, sans-serif'
              }}>
                يجب عليك تسجيل الدخول
              </h3>
              <p style={{
                color: '#666',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '0',
                fontFamily: 'Cairo, sans-serif'
              }}>
                لإكمال عملية الدفع، يرجى تسجيل الدخول إلى حسابك أولاً
              </p>
            </div>
            
            {/* Footer */}
            <div style={{
              padding: '0 30px 35px',
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button 
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Cairo, sans-serif',
                  background: 'linear-gradient(135deg, #5FA9A9 0%, #407C7C 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(95, 169, 169, 0.3)'
                }}
                onClick={() => {
                  // فتح نافذة تسجيل الدخول في الـ Navbar
                  const loginEvent = new CustomEvent('openLoginModal');
                  window.dispatchEvent(loginEvent);
                  navigate('/');
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(95, 169, 169, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(95, 169, 169, 0.3)';
                }}
              >
                <i className="bx bx-log-in" style={{ marginLeft: '8px' }}></i>
                تسجيل الدخول
              </button>
              <button 
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  border: '2px solid #e9ecef',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Cairo, sans-serif',
                  background: '#f8f9fa',
                  color: '#666'
                }}
                onClick={() => navigate('/')}
                onMouseOver={(e) => {
                  e.target.style.background = '#e9ecef';
                  e.target.style.color = '#495057';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.color = '#666';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="bx bx-x" style={{ marginLeft: '8px' }}></i>
                إغلاق
              </button>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @media (max-width: 576px) {
            .login-modal-content {
              margin: 15px;
              border-radius: 15px;
            }
          }
        `}</style>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
