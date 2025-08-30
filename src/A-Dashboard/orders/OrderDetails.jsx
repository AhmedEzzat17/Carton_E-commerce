import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details
  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getById(id);

      if (response.data && response.data.data) {
        setOrder(response.data.data);
      } else {
        setError("الطلب غير موجود");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("حدث خطأ في تحميل تفاصيل الطلب");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, fetchOrderDetails]);

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  // Get status text in Arabic
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "في الانتظار";
      case "processing":
        return "قيد المعالجة";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التسليم";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  // Format date
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

  // Format price
  const formatPrice = (price) => {
    if (!price) return "0.00";
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-container">
          <div className="error-icon">!!!</div>
          <h3>حدث خطأ</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchOrderDetails}>
            إعادة المحاولة
          </button>
          <Link to="/Dashboard/orders" className="back-btn">
            العودة للطلبات
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-container">
          <div className="error-icon">📦</div>
          <h3>الطلب غير موجود</h3>
          <p>لم يتم العثور على الطلب المطلوب</p>
          <Link to="/Dashboard/orders" className="back-btn">
            العودة للطلبات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      {/* ====== Header ====== */}
      <div className="order-header">
        <div className="header-content">
          <button
            className="back-btn"
            onClick={() => navigate("/Dashboard/orders")}
          >
            <i className="bx bx-arrow-right"></i>
            العودة للطلبات
          </button>

          <div className="title-section">
            <h1 className="page-title">
              <i className="bx bxs-shopping-bag"></i>
              تفاصيل الطلب #{order.id}
            </h1>
            <div className="order-meta">
              <span className="order-date">
                <i className="bx bx-calendar"></i>
                {formatDate(order.created_at)}
              </span>
              <span
                className={`order-status ${getStatusBadgeClass(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Content ====== */}
      <div className="order-content">
        {/* ---- Order Summary ---- */}
        <div className="order-summary-card card">
          <div className="card-header">
            <h3>
              <i className="bx bx-receipt"></i> ملخص الطلب
            </h3>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">رقم الطلب</span>
              <span className="summary-value">#{order.id}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">رقم المرجع</span>
              <span className="summary-value">{order.order_number}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">تاريخ الطلب</span>
              <span className="summary-value">
                {formatDate(order.created_at)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">حالة الطلب</span>
              <span
                className={`status-badge ${getStatusBadgeClass(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">المبلغ الإجمالي</span>
              <span className="summary-value total-amount">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* ---- Details (Customer + Shipping) ---- */}
        <div className="details-grid">
          {/* Customer */}
          <div className="details-card card">
            <div className="card-header">
              <h3>
                <i className="bx bx-user"></i> معلومات العميل
              </h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">الاسم</span>
                <span className="info-value">
                  {order.user?.name || "غير محدد"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">البريد الإلكتروني</span>
                <span className="info-value">
                  {order.user?.email || "غير محدد"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">رقم الهاتف</span>
                <span className="info-value">
                  {order.user?.phone || "غير محدد"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="details-card card">
            <div className="card-header">
              <h3>
                <i className="bx bx-map"></i> معلومات الشحن
              </h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">العنوان</span>
                <span className="info-value">
                  {order.shipping_address?.address || "غير محدد"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">طريقة الدفع</span>
                <span className="info-value">
                  {order.payment_method === "bank_transfer"
                    ? "تحويل بنكي"
                    : order.payment_method === "cash_on_delivery"
                    ? "الدفع عند الاستلام"
                    : order.payment_method === "credit_card"
                    ? "بطاقة ائتمان"
                    : "غير محدد"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">رقم التتبع</span>
                <span className="info-value">
                  {order.tracking_number || "غير متوفر"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">رابط التتبع</span>
                <span className="info-value">
                  {order.tracking_url ? (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tracking-link"
                    >
                      تتبع الطلب
                    </a>
                  ) : (
                    "غير متوفر"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Order Items ---- */}
        <div className="order-items-card card">
          <div className="card-header">
            <h3>
              <i className="bx bx-package"></i> منتجات الطلب
            </h3>
          </div>
          <div className="card-content">
            {order.order_items && order.order_items.length > 0 ? (
              <div className="items-table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>المنتج</th>
                      <th>الكمية</th>
                      <th>السعر</th>
                      <th>المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item, index) => (
                      <tr key={item?.id || index} className="item-row">
                        <td className="product-info">
                          <div className="product-details">
                            <div className="product-thumb">
                              {item.product?.images ? (
                                <img
                                  src={`https://myappapi.fikriti.com/${item.product.images}`}
                                  alt={item.product?.name || "صورة المنتج"}
                                  loading="lazy"
                                />
                              ) : (
                                <i
                                  className="bx bx-image-alt product-thumb-icon"
                                  aria-hidden="true"
                                ></i>
                              )}
                            </div>

                            <div className="product-text">
                              <div
                                className="product-name"
                                title={item.product?.name || ""}
                              >
                                {item.product?.name || "منتج غير محدد"}
                              </div>
                              <div className="product-sku">
                                SKU: {item.product?.sku || "غير محدد"}
                              </div>
                              {item.product?.description && (
                                <div className="product-description">
                                  {item.product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="quantity">
                          <span className="quantity-badge">
                            {item.quantity}
                          </span>
                        </td>

                        <td className="price">
                          {formatPrice(item.unit_price)}
                        </td>

                        <td className="total">{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-items">
                <div className="empty-icon">
                  <i className="bx bx-package"></i>
                </div>
                <p>لا توجد منتجات في هذا الطلب</p>
              </div>
            )}
          </div>
        </div>

        {/* ---- Totals ---- */}
        <div className="order-totals-card card">
          <div className="card-header">
            <h3>
              <i className="bx bx-calculator"></i> إجمالي الطلب
            </h3>
          </div>
          <div className="card-content">
            <div className="totals-wrap">
              <div className="totals-list">
                <div className="total-item is-sub">
                  <span className="total-label">المجموع الفرعي</span>
                  <span className="total-value">
                    {formatPrice(
                      order.order_items?.reduce(
                        (sum, item) => sum + parseFloat(item.subtotal),
                        0
                      ) || 0
                    )}
                  </span>
                </div>

                <div className="total-item is-grand">
                  <span className="total-label">المجموع الإجمالي</span>
                  <span className="total-value">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Notes ---- */}
        {order.notes && (
          <div className="order-notes-card card">
            <div className="card-header">
              <h3>
                <i className="bx bx-note"></i> ملاحظات الطلب
              </h3>
            </div>
            <div className="card-content">
              <div className="notes-content">{order.notes}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
