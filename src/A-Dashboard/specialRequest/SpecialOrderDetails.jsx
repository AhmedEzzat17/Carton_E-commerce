// src/A-Dashboard/specialRequest/SpecialOrderDetails.jsx
// صفحة تفاصيل الطلب الخاص - جاهزة للعمل مع API الحقيقي
// تتطلب API endpoints حسب ملف SPECIAL_ORDERS_API_REQUIREMENTS.md
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import specialOrderService from "../../services/specialOrderService";
import "./SpecialOrderDetails.css";

const SpecialOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialOrder, setSpecialOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSpecialOrderDetails();
  }, [id]);

  const fetchSpecialOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching special order details for ID: ${id}`);
      const response = await specialOrderService.getById(id);
      
      console.log("📦 Special Order Details API Response:", response);
      console.log("🔍 Raw Special Order Data:", response.data?.data);
      
      if (response.data && response.data.data) {
        const orderData = response.data.data;
        
        // معالجة البيانات بنفس طريقة OrderDetails.jsx
        const processedOrder = {
          ...orderData,
          product: orderData.product || { name: "منتج مخصص" },
          user: orderData.user || { name: "غير محدد", email: "غير محدد", phone: "غير محدد" },
          length: orderData.length || 0,
          width: orderData.width || 0,
          height: orderData.height || 0,
          size: orderData.size || "غير محدد",
          attachment_file: orderData.attachment_file || null,
          note: orderData.note || "لا توجد ملاحظات",
        };
        
        console.log("✅ Processed Special Order Data:", processedOrder);
        setSpecialOrder(processedOrder);
      } else {
        setError("لم يتم العثور على الطلب الخاص");
      }
    } catch (err) {
      console.error("❌ Error fetching special order details:", err);
      setError("حدث خطأ في تحميل تفاصيل الطلب الخاص");
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDimensions = (length, width, height) => {
    if (!length && !width && !height) return "غير محدد";
    return `${length || 0} × ${width || 0} × ${height || 0}`;
  };

  if (loading) {
    return (
      <div className="special-order-details-container2sr">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل تفاصيل الطلب الخاص...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="special-order-details-container2sr">
        <div className="error-container">
          <div className="error-icon">!!</div>
          <h3>حدث خطأ</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchSpecialOrderDetails}>
            إعادة المحاولة
          </button>
          <button className="back-btn" onClick={() => navigate("/Dashboard/special-orders")}>
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  if (!specialOrder) {
    return (
      <div className="special-order-details-container2sr">
        <div className="error-container">
          <div className="error-icon">📦</div>
          <h3>لم يتم العثور على الطلب الخاص</h3>
          <p>الطلب الخاص المطلوب غير موجود أو تم حذفه</p>
          <button className="back-btn" onClick={() => navigate("/Dashboard/special-orders")}>
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="special-order-details-container2sr">
      {/* Header */}
      <div className="special-order-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="back-button"
              onClick={() => navigate("/Dashboard/special-orders")}
            >
              <i className="bx bx-arrow-back"></i>
              العودة للقائمة
            </button>
          </div>
          <div className="header-center">
            <h1 className="page-title">
              <i className="bx bxs-package"></i>
              تفاصيل الطلب الخاص #{specialOrder.id}
            </h1>
            <p className="page-subtitle">
              تاريخ الإنشاء: {formatDate(specialOrder.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="special-order-content">
        <div className="content-grid">
          
          {/* Customer Information */}
          <div className="info-card">
            <div className="card-header">
              <h3>
                <i className="bx bxs-user"></i>
                معلومات العميل
              </h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="label">الاسم:</span>
                <span className="value">{specialOrder.user?.name || "غير محدد"}</span>
              </div>
              <div className="info-row">
                <span className="label">البريد الإلكتروني:</span>
                <span className="value">{specialOrder.user?.email || "غير محدد"}</span>
              </div>
              <div className="info-row">
                <span className="label">رقم الهاتف:</span>
                <span className="value">{specialOrder.user?.phone || "غير محدد"}</span>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="info-card">
            <div className="card-header">
              <h3>
                <i className="bx bxs-package"></i>
                معلومات المنتج
              </h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="label">اسم المنتج:</span>
                <span className="value">{specialOrder.product?.name || "منتج مخصص"}</span>
              </div>
              <div className="info-row">
                <span className="label">الحجم المطلوب:</span>
                <span className="value size-badge">{specialOrder.size}</span>
              </div>
              {specialOrder.product?.image && (
                <div className="info-row">
                  <span className="label">صورة المنتج:</span>
                  <div className="product-image">
                    <img 
                      src={specialOrder.product.image} 
                      alt={specialOrder.product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dimensions */}
          <div className="info-card">
            <div className="card-header">
              <h3>
                <i className="bx bxs-ruler"></i>
                الأبعاد المطلوبة
              </h3>
            </div>
            <div className="card-body">
              <div className="dimensions-grid">
                <div className="dimension-item">
                  <span className="dimension-label">الطول</span>
                  <span className="dimension-value">{specialOrder.length || 0}</span>
                  <span className="dimension-unit">سم</span>
                </div>
                <div className="dimension-item">
                  <span className="dimension-label">العرض</span>
                  <span className="dimension-value">{specialOrder.width || 0}</span>
                  <span className="dimension-unit">سم</span>
                </div>
                <div className="dimension-item">
                  <span className="dimension-label">الارتفاع</span>
                  <span className="dimension-value">{specialOrder.height || 0}</span>
                  <span className="dimension-unit">سم</span>
                </div>
              </div>
              <div className="dimensions-summary">
                <strong>الأبعاد الإجمالية: {formatDimensions(specialOrder.length, specialOrder.width, specialOrder.height)}</strong>
              </div>
            </div>
          </div>

          {/* Attachment File */}
          {specialOrder.attachment_file && (
            <div className="info-card">
              <div className="card-header">
                <h3>
                  <i className="bx bxs-file"></i>
                  الملف المرفق
                </h3>
              </div>
              <div className="card-body">
                <div className="attachment-info">
                  <div className="attachment-icon">
                    <i className="bx bxs-file-pdf"></i>
                  </div>
                  <div className="attachment-details">
                    <span className="attachment-name">{specialOrder.attachment_file}</span>
                    <span className="attachment-type">ملف مرفق من العميل</span>
                  </div>
                  <a 
                    href={specialOrder.attachment_file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-btn"
                  >
                    <i className="bx bx-download"></i>
                    تحميل
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="info-card full-width">
            <div className="card-header">
              <h3>
                <i className="bx bxs-note"></i>
                ملاحظات العميل
              </h3>
            </div>
            <div className="card-body">
              <div className="notes-content">
                {specialOrder.note || "لا توجد ملاحظات إضافية"}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SpecialOrderDetails;
