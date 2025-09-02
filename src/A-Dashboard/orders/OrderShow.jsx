import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";
import "./OrderShow.css";

const OrderShow = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch orders from API
  const fetchOrders = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getWithPagination(page, search);

      console.log("📦 Full API Response:", response); // اطبع الاستجابة كلها
      console.log("📦 Orders Data:", response.data?.data?.data); // اطبع Array الطلبات

      if (response.data && response.data.data) {
        let paginated = response.data.data; // ده فيه current_page, last_page, data[]

        let filteredOrders = Array.isArray(paginated.data)
          ? paginated.data
          : [];

        // Apply status filter
        if (status !== "all") {
          filteredOrders = filteredOrders.filter(
            (order) => order.status?.toLowerCase() === status.toLowerCase()
          );
        }

        setOrders(filteredOrders);
        setTotalPages(paginated.last_page || 1);
        setCurrentPage(paginated.current_page || 1);
      } else {
        setOrders([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(" Error fetching orders:", err);
      setError("حدث خطأ في تحميل الطلبات");
      setOrders([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, filterStatus);
  }, [currentPage, searchTerm, filterStatus]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

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
      <div className="orders-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-container">
          <div className="error-icon">!!</div>
          <h3>حدث خطأ</h3>
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={() => fetchOrders(currentPage, searchTerm, filterStatus)}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {/* Header Section */}
      <div className="orders-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">
              <i className="bx bxs-shopping-bag"></i>
              إدارة الطلبات
            </h1>
            <p className="page-subtitle">عرض وإدارة جميع طلبات العملاء</p>
          </div>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="bx bx-time"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">
                  {
                    (orders || []).filter(
                      (o) => o.status?.toLowerCase() === "pending"
                    ).length
                  }
                </span>
                <span className="stat-label">في الانتظار</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon processing">
                <i className="bx bx-cog"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">
                  {
                    (orders || []).filter(
                      (o) => o.status?.toLowerCase() === "processing"
                    ).length
                  }
                </span>
                <span className="stat-label">قيد المعالجة</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon delivered">
                <i className="bx bx-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">
                  {
                    (orders || []).filter(
                      (o) => o.status?.toLowerCase() === "delivered"
                    ).length
                  }
                </span>
                <span className="stat-label">تم التسليم</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="Osearch-box">
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="status-filters">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => handleStatusFilter("all")}
          >
            جميع الطلبات
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "pending" ? "active" : ""
            }`}
            onClick={() => handleStatusFilter("pending")}
          >
            في الانتظار
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "processing" ? "active" : ""
            }`}
            onClick={() => handleStatusFilter("processing")}
          >
            قيد المعالجة
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "shipped" ? "active" : ""
            }`}
            onClick={() => handleStatusFilter("shipped")}
          >
            تم الشحن
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "delivered" ? "active" : ""
            }`}
            onClick={() => handleStatusFilter("delivered")}
          >
            تم التسليم
          </button>
        </div>
      </div>

{/* Orders Table */}
<div className="orders-table-container1">
  <div className="table-header1">
    <h3>قائمة الطلبات</h3>
    <span className="orders-count">({(orders || []).length} طلب)</span>
  </div>

  {(orders || []).length === 0 ? (
    <div className="empty-state">
      <div className="empty-icon">
        <i className="bx bx-shopping-bag"></i>
      </div>
      <h3>لا توجد طلبات</h3>
      <p>لم يتم العثور على أي طلبات تطابق معايير البحث</p>
    </div>
  ) : (
    <div className="table-responsive">
      <table className="orders-table">
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>التاريخ</th>
            <th>المبلغ الإجمالي</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {(orders || []).map((order) => (
            <tr key={order.id} className="order-row1">
              <td className="order-number">
                <span className="order-ref">{order.order_number}</span>
              </td>

              <td className="order-date">
                {formatDate(order.created_at)}
              </td>

              <td className="order-total">
                <span className="total-amount">
                  {formatPrice(order.total_amount)}
                </span>
              </td>

              <td className="order-status">
                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </td>

              <td className="order-actions">
                <Link
                  to={`/Dashboard/orders/${order.id}`}
                  className="action-btn details-btn"
                  title="عرض التفاصيل"
                >
                  <i className="bx bx-show"></i>
                  تفاصيل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="bx bx-chevron-right"></i>
              السابق
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`pagination-number ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              التالي
              <i className="bx bx-chevron-left"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderShow;
