import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSync } from 'react-icons/fa';
import orderService from "../../services/orderService";
import OrderService from "../../services/interface/orderService"; // النظام الذكي
import "./OrderShow.css";

const OrderShow = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // جميع الطلبات الأصلية
  const [filteredOrders, setFilteredOrders] = useState([]); // الطلبات بعد الفلترة
  const [displayedOrders, setDisplayedOrders] = useState([]); // الطلبات المعروضة في الصفحة الحالية
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0); // العدد الإجمالي للطلبات
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const ITEMS_PER_PAGE = 10; // عدد الطلبات في كل صفحة
  const [lastFetchTime, setLastFetchTime] = useState(0); // لتجنب التحديثات المتكررة

  // Fetch orders from API - نظام ذكي متعدد المصادر
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 بدء جلب الطلبات للداشبورد...');
      
      let response;
      let fetchedOrders = [];
      
      try {
        // المحاولة الأولى: استخدام النظام الذكي
        response = await OrderService.getUserOrders({ withAuth: true });
        console.log('✅ نجح جلب الطلبات بالنظام الذكي');
        
        // معالجة البيانات من النظام الذكي
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          fetchedOrders = response.data.data.data;
          console.log(`📊 تم جلب ${fetchedOrders.length} طلب من النظام الذكي`);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          fetchedOrders = response.data.data;
          console.log(`📊 تم جلب ${fetchedOrders.length} طلب (تركيب بديل)`);
        }
      } catch (smartError) {
        console.warn('⚠️ فشل النظام الذكي، جرب الطريقة القديمة...');
        
        // المحاولة الثانية: استخدام الطريقة القديمة
        try {
          response = await orderService.getWithPagination(1, "");
          console.log('✅ نجح جلب الطلبات بالطريقة القديمة');
          
          if (response.data && response.data.data) {
            let paginated = response.data.data;
            fetchedOrders = Array.isArray(paginated.data) ? paginated.data : [];
            console.log(`📊 تم جلب ${fetchedOrders.length} طلب من الطريقة القديمة`);
          }
        } catch (oldError) {
          console.error('❌ فشلت جميع طرق جلب الطلبات');
          throw oldError;
        }
      }

      // دمج بيانات localStorage مع API لضمان عرض جميع الطلبات
      const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
      console.log(`💾 طلبات localStorage: ${recentOrders.length}`);
      
      // دمج الطلبات مع تجنب التكرار
      const allOrdersMap = new Map();
      
      // إضافة طلبات API
      fetchedOrders.forEach(order => {
        allOrdersMap.set(order.id, order);
      });
      
      // إضافة طلبات localStorage (بيانات أحدث)
      recentOrders.forEach(order => {
        if (order.id && !allOrdersMap.has(order.id)) {
          // إضافة بيانات المستخدم إذا لم تكن موجودة
          if (!order.user && order.user_name) {
            order.user = {
              id: order.user_id,
              name: order.user_name,
              email: order.user_email,
              phone: order.user_phone
            };
          }
          allOrdersMap.set(order.id, order);
          console.log(`🔄 أضيف طلب من localStorage: ${order.id}`);
        }
      });
      
      const combinedOrders = Array.from(allOrdersMap.values())
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
      
      if (combinedOrders.length > 0) {
        const total = combinedOrders.length;
        setTotalOrders(total);
        
        console.log(`📊 إجمالي الطلبات (مدمجة): ${total}`);
        console.log(`📊 API: ${fetchedOrders.length}, localStorage: ${recentOrders.length}, مدمجة: ${total}`);

        setAllOrders(combinedOrders);
        setFilteredOrders(combinedOrders);
        
        const pages = Math.ceil(combinedOrders.length / ITEMS_PER_PAGE);
        setTotalPages(pages);
        
        // عرض الصفحة الأولى
        setDisplayedOrders(combinedOrders.slice(0, ITEMS_PER_PAGE));
        setLastFetchTime(Date.now());
      } else {
        console.log('ℹ️ لا توجد طلبات');
        setAllOrders([]);
        setFilteredOrders([]);
        setDisplayedOrders([]);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error('❌ خطأ في تحميل الطلبات:', err);
      setError('حدث خطأ في تحميل الطلبات');
      setAllOrders([]);
      setFilteredOrders([]);
      setDisplayedOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async (forceRefresh = false) => {
    // تجنب التحديثات المتكررة - إلا إذا كان المستخدم يضغط على الزر
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 30000) {
      console.log('تم تجاهل التحديث - تم التحديث مؤخراً');
      return;
    }

    console.log('🔄 بدء تحديث الطلبات...');

    // إضافة timeout لتجنب التعليق
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    try {
      await Promise.race([fetchOrders(), timeoutPromise]);
      console.log('✅ تم تحديث الطلبات بنجاح');
    } catch (error) {
      console.error('Refresh timeout or error:', error);
      setError('انتهت مهلة الاتصال - يرجى المحاولة مرة أخرى');
      setLoading(false);
    }
  };

  // مستمع للطلبات الجديدة من الموقع - محسن
  useEffect(() => {
    const handleNewOrder = (event) => {
      console.log('🔔 تم استلام إشارة طلب جديد:', event.detail);
      
      // تحديث فوري مع تأخير قصير لضمان حفظ الطلب
      setTimeout(() => {
        console.log('🔄 تحديث الداشبورد بعد إضافة طلب جديد...');
        refreshOrders(true);
      }, 1000); // تأخير ثانية واحدة
    };

    // إضافة المستمع
    window.addEventListener('newOrderAdded', handleNewOrder);

    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => {
      window.removeEventListener('newOrderAdded', handleNewOrder);
    };
  }, []);

  // تحديث تلقائي عند التركيز على النافذة - معطل لتحسين الأداء
  // useEffect(() => {
  //   const handleFocus = () => {
  //     refreshOrders();
  //   };

  //   window.addEventListener('focus', handleFocus);
  //   return () => window.removeEventListener('focus', handleFocus);
  // }, []);

  // مستمع للأحداث المخصصة - محسن للأداء
  useEffect(() => {
    let refreshTimeout;
    
    const handleNewOrder = () => {
      // تأخير التحديث لتجنب التحديثات المتكررة
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        refreshOrders();
      }, 1000); // تأخير ثانية واحدة
    };

    const handleOrderUpdate = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        refreshOrders();
      }, 1000);
    };
    
    // معالج تحديث حالة الطلب - تحديث فوري بدون إعادة تحميل
    const handleStatusUpdate = (event) => {
      const { orderId, newStatus } = event.detail;
      console.log(`🔔 تم استلام إشارة تحديث حالة الطلب ${orderId} → ${newStatus}`);
      
      // تحديث محلي فوري للحالة
      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order.id == orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      setFilteredOrders(prevOrders => 
        prevOrders.map(order => 
          order.id == orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      setDisplayedOrders(prevOrders => 
        prevOrders.map(order => 
          order.id == orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      console.log(`✅ تم تحديث حالة الطلب ${orderId} في الجدول فوراً`);
    };

    window.addEventListener('newOrderAdded', handleNewOrder);
    window.addEventListener('ordersUpdated', handleOrderUpdate);
    window.addEventListener('orderStatusUpdated', handleStatusUpdate);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('newOrderAdded', handleNewOrder);
      window.removeEventListener('ordersUpdated', handleOrderUpdate);
      window.removeEventListener('orderStatusUpdated', handleStatusUpdate);
    };
  }, []);

  // تحميل أولي للطلبات - مرة واحدة فقط
  useEffect(() => {
    fetchOrders();
  }, []); // مصفوفة فارغة = تشغيل مرة واحدة فقط

  // فلترة محلية - بدون API calls
  useEffect(() => {
    let filtered = [...allOrders];

    // فلتر حسب البحث
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.order_number?.toLowerCase().includes(searchLower) ||
          order.id?.toString().includes(searchLower) ||
          order.user?.name?.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower)
        );
      });
    }

    // فلتر حسب الحالة
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
    
    // حساب عدد الصفحات بعد الفلترة
    const pages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(pages);
    
    // الرجوع للصفحة الأولى عند تغيير الفلتر
    setCurrentPage(1);
    
    // عرض الصفحة الأولى
    setDisplayedOrders(filtered.slice(0, ITEMS_PER_PAGE));
  }, [searchTerm, filterStatus, allOrders, ITEMS_PER_PAGE]);

  // تحديث الطلبات المعروضة عند تغيير الصفحة
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
  }, [currentPage, filteredOrders, ITEMS_PER_PAGE]);

  // Handle search - محلي بدون API
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter - محلي بدون API
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
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
      case "completed":
        return "status-completed";
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
      case "completed":
        return "مكتمل";
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
                    (allOrders || []).filter(
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
                    (allOrders || []).filter(
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
                    (allOrders || []).filter(
                      (o) => o.status?.toLowerCase() === "completed"
                    ).length
                  }
                </span>
                <span className="stat-label">مكتمل</span>
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
              filterStatus === "completed" ? "active" : ""
            }`}
            onClick={() => handleStatusFilter("completed")}
          >
            مكتمل
          </button>
        </div>
      </div>
{/* Orders Table */}
<div className="orders-table-container1">
  <div className="table-header-with-refresh me-2 mt-2">
    <h3>قائمة الطلبات</h3>
    <button className="refresh-btn-dashboard" onClick={() => refreshOrders(true)} disabled={loading}>
      <FaSync className={loading ? 'fa-spin' : ''} />
      تحديث
    </button>
  </div>
  <span className="orders-count me-2">
    ({totalOrders > 0 ? `${totalOrders} طلب إجمالي` : `${(filteredOrders || []).length} طلب`})
  </span>
  {(displayedOrders || []).length === 0 ? (
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
          {(displayedOrders || []).map((order) => (
            <tr key={order.id} className="order-row1">
              <td className="order-number1">
                <span className="order-ref">{order.order_number}</span>
              </td>

              <td className="order-date">
                {formatDate(order.created_at)}
              </td>

              <td className="order-total1">
                <span className="total-amount1">
                  {formatPrice(order.total_amount)}
                </span>
              </td>

              <td className="order-status">
                <span className={`status-badge1 ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </td>

              <td className="order-actions1">
                <Link
                  to={`/Dashboard/orders/${order.id}`}
                  className="action-btn1 details-btn1"
                  title="عرض التفاصيل"
                  onClick={() => window.scrollTo(0, 0)}
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

      <style>{`
        .table-header-with-refresh {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .refresh-btn-dashboard {
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .refresh-btn-dashboard:hover:not(:disabled) {
          background: var(--primary-color);
          transform: translateY(-1px);
        }

        .refresh-btn-dashboard:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default OrderShow;
