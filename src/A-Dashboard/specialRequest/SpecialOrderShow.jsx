// src/A-Dashboard/specialRequest/SpecialOrderShow.jsx
// صفحة عرض قائمة الطلبات الخاصة - جاهزة للعمل مع API الحقيقي
// تتطلب API endpoints حسب ملف SPECIAL_ORDERS_API_REQUIREMENTS.md
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSync } from "react-icons/fa";
import specialOrderService from "../../services/specialOrderService";
import "./SpecialOrderShow.css";

const SpecialOrderShow = () => {
  const [specialOrders, setSpecialOrders] = useState([]);
  const navigate = useNavigate();
  const [allSpecialOrders, setAllSpecialOrders] = useState([]); // جميع الطلبات الأصلية
  const [filteredSpecialOrders, setFilteredSpecialOrders] = useState([]); // الطلبات بعد الفلترة
  const [displayedSpecialOrders, setDisplayedSpecialOrders] = useState([]); // الطلبات المعروضة في الصفحة الحالية
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSpecialOrders, setTotalSpecialOrders] = useState(0); // العدد الإجمالي للطلبات الخاصة
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 10; // عدد الطلبات في كل صفحة
  const [lastFetchTime, setLastFetchTime] = useState(0); // لتجنب التحديثات المتكررة

  // Fetch special orders from API - محسن للأداء
  const fetchSpecialOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await specialOrderService.getWithPagination(1, "");
      console.log("📦 Full Special Orders API Response:", response);

      if (response.data && response.data.data) {
        let paginated = response.data.data;
        let fetchedOrders = Array.isArray(paginated.data)
          ? paginated.data
          : [];

        // حفظ العدد الإجمالي من API response
        const total = paginated.total || fetchedOrders.length;
        setTotalSpecialOrders(total);
        
        console.log(`📆 Total Special Orders: ${total}, Current Page Orders: ${fetchedOrders.length}`);

        // ترتيب الطلبات لتظهر الأحدث أولاً
        const sortedOrders = fetchedOrders.sort((a, b) => {
          const dateA = new Date(a.created_at || a.updated_at || 0);
          const dateB = new Date(b.created_at || b.updated_at || 0);
          return dateB - dateA; // الأحدث أولاً
        });

        setAllSpecialOrders(sortedOrders);
        setFilteredSpecialOrders(sortedOrders);
        
        const pages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
        setTotalPages(pages);
        
        // عرض الصفحة الأولى من الطلبات المرتبة
        setDisplayedSpecialOrders(sortedOrders.slice(0, ITEMS_PER_PAGE));
        setLastFetchTime(Date.now()); // حفظ وقت آخر تحديث
      }
    } catch (error) {
      console.error("❌ Error fetching special orders:", error);
      
      // رسائل خطأ مخصصة حسب نوع المشكلة
      let errorMessage = "حدث خطأ في جلب الطلبات الخاصة";
      
      if (error.response?.status === 500) {
        errorMessage = "خطأ في الخادم - API الطلبات الخاصة غير متوفر حالياً. يرجى التواصل مع المطور لإنشاء endpoints المطلوبة.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint غير موجود. يرجى التأكد من إنشاء /api/v1/dashboard/special-orders في الباك إند.";
      } else if (error.response?.status === 401) {
        errorMessage = "غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.";
      } else if (!error.response) {
        errorMessage = "مشكلة في الاتصال بالخادم. يرجى التحقق من الإنترنت.";
      }
      
      setError(errorMessage);
      
      setAllSpecialOrders([]);
      setFilteredSpecialOrders([]);
      setDisplayedSpecialOrders([]);
      setTotalSpecialOrders(0);
    } finally {
      setLoading(false);
      setLastFetchTime(Date.now());
    }
  };

  const refreshSpecialOrders = async (forceRefresh = false) => {
    // تجنب التحديثات المتكررة - إلا إذا كان المستخدم يضغط على الزر
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 30000) {
      console.log('تم تجاهل التحديث - تم التحديث مؤخراً');
      return;
    }

    console.log('🔄 بدء تحديث الطلبات الخاصة...');

    // إضافة timeout لتجنب التعليق
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    try {
      await Promise.race([fetchSpecialOrders(), timeoutPromise]);
      console.log('✅ تم تحديث الطلبات الخاصة بنجاح');
    } catch (error) {
      console.error('Refresh timeout or error:', error);
      setError('انتهت مهلة الاتصال - يرجى المحاولة مرة أخرى');
      setLoading(false);
    }
  };

  // مستمع للأحداث المخصصة - محسن للأداء
  useEffect(() => {
    let refreshTimeout;
    
    const handleNewSpecialOrder = () => {
      // تأخير التحديث لتجنب التحديثات المتكررة
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        refreshSpecialOrders();
      }, 1000); // تأخير ثانية واحدة
    };

    const handleSpecialOrderUpdate = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        refreshSpecialOrders();
      }, 1000);
    };

    window.addEventListener('newSpecialOrderAdded', handleNewSpecialOrder);
    window.addEventListener('specialOrdersUpdated', handleSpecialOrderUpdate);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('newSpecialOrderAdded', handleNewSpecialOrder);
      window.removeEventListener('specialOrdersUpdated', handleSpecialOrderUpdate);
    };
  }, []);

  // تحميل أولي للطلبات الخاصة - مرة واحدة فقط
  useEffect(() => {
    fetchSpecialOrders();
  }, []); // مصفوفة فارغة = تشغيل مرة واحدة فقط

  // فلترة محلية - بدون API calls
  useEffect(() => {
    let filtered = [...allSpecialOrders];

    // فلتر حسب البحث
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.id?.toString().includes(searchLower) ||
          order.user?.name?.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower) ||
          order.product?.name?.toLowerCase().includes(searchLower) ||
          order.size?.toLowerCase().includes(searchLower) ||
          order.quantity?.toString().includes(searchLower) ||
          order.phone?.includes(searchLower) ||
          order.user?.phone?.includes(searchLower)
        );
      });
    }

    // ترتيب الطلبات المفلترة لتظهر الأحدث أولاً
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || a.updated_at || 0);
      const dateB = new Date(b.created_at || b.updated_at || 0);
      return dateB - dateA; // الأحدث أولاً
    });

    setFilteredSpecialOrders(filtered);
    
    // حساب عدد الصفحات بعد الفلترة
    const pages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(pages);
    
    // الرجوع للصفحة الأولى عند تغيير الفلتر
    setCurrentPage(1);
    
    // عرض الصفحة الأولى
    setDisplayedSpecialOrders(filtered.slice(0, ITEMS_PER_PAGE));
  }, [searchTerm, allSpecialOrders, ITEMS_PER_PAGE]);

  // تحديث الطلبات المعروضة عند تغيير الصفحة
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedSpecialOrders(filteredSpecialOrders.slice(startIndex, endIndex));
  }, [currentPage, filteredSpecialOrders, ITEMS_PER_PAGE]);

  // Handle search - محلي بدون API
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  // Format dimensions
  const formatDimensions = (length, width, height) => {
    if (!length && !width && !height) return "غير محدد";
    return `${length || 0} × ${width || 0} × ${height || 0}`;
  };

  if (loading) {
    return (
      <div className="special-orders-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الطلبات الخاصة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="special-orders-container2sr">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>مشكلة في API الطلبات الخاصة</h3>
          <p className="error-message">{error}</p>
          
          {error.includes("500") && (
            <div className="developer-info">
              <h4>📋 للمطور:</h4>
              <ul>
                <li>يرجى إنشاء API endpoint: <code>GET /api/v1/dashboard/special-orders</code></li>
                <li>راجع ملف <code>SPECIAL_ORDERS_API_REQUIREMENTS.md</code> للتفاصيل الكاملة</li>
                <li>تأكد من إنشاء جدول <code>special_orders</code> في قاعدة البيانات</li>
              </ul>
            </div>
          )}
          
          <button
            className="retry-btn"
            onClick={() => fetchSpecialOrders()}
          >
            <FaSync /> إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="special-orders-container2sr">
      {/* Header Section */}
      <div className="special-orders-header2sr">
        <div className="header-content2sr">
          <div className="title-section2sr">
            <h1 className="page-title2sr">
              <i className="bx bxs-package"></i>
              إدارة الطلبات الخاصة
            </h1>
            <p className="page-subtitle2sr">عرض وإدارة جميع الطلبات الخاصة للعملاء</p>
          </div>
          <div className="stats-cards2sr">
            <div className="stat-card2sr">
              <div className="stat-icon2sr total">
                <i className="bx bx-package"></i>
              </div>
              <div className="stat-info2sr">
                <span className="stat-number2sr">
                  {totalSpecialOrders}
                </span>
                <span className="stat-label2sr">إجمالي الطلبات</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section2sr">
        <div className="Osearch-box2sr">
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="البحث في الطلبات الخاصة..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input2sr"
          />
        </div>

      </div>

      {/* Special Orders Table */}
      <div className="special-orders-table-container1">
        <div className="table-header-with-refresh me-2 mt-2">
          <h3>قائمة الطلبات الخاصة</h3>
          <button className="refresh-btn-dashboard" onClick={() => refreshSpecialOrders(true)} disabled={loading}>
            <FaSync className={loading ? 'fa-spin' : ''} />
            تحديث
          </button>
        </div>
        <span className="special-orders-count me-2">
          ({totalSpecialOrders > 0 ? `${totalSpecialOrders} طلب خاص إجمالي` : `${(filteredSpecialOrders || []).length} طلب خاص`})
        </span>
        {(displayedSpecialOrders || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bx bx-package"></i>
            </div>
            <h3>لا توجد طلبات خاصة</h3>
            <p>لم يتم العثور على أي طلبات خاصة تطابق معايير البحث</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="special-orders-table" style={{textAlign: 'center', width: '100%'}}>
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>المنتج</th>
                  <th>الكمية</th>
                  <th>رقم الهاتف</th>
                  <th>الأبعاد</th>
                  <th>الحجم</th>
                  <th>التاريخ</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {(displayedSpecialOrders || []).map((order) => (
                  <tr key={order.id} className="special-order-row1" style={{textAlign: 'center'}}>
                    <td className="special-order-number1">
                      <span className="order-ref">#{order.id}</span>
                    </td>

                    <td className="customer-info" style={{textAlign: 'center'}}>
                      <div className="customer-details" style={{textAlign: 'center'}}>
                        <span className="customer-name">{order.user?.name || ""}</span>
                        <small className="customer-email">{order.user?.email || ""}</small>
                      </div>
                    </td>

                    <td className="product-info" style={{textAlign: 'center'}}>
                      <span className="product-name">{order.product?.name || ""}</span>
                    </td>

                    <td className="quantity" style={{textAlign: 'center'}}>
                      <span className="quantity-badge">{order.quantity || ""}</span>
                    </td>

                    <td className="phoneSO" style={{textAlign: 'center'}}>
                      <span className="phone-textSO">
                        {order.phone || order.user?.phone || ""}
                      </span>
                    </td>

                    <td className="dimensions">
                      <span className="dimensions-text">
                        {formatDimensions(order.length, order.width, order.height)}
                      </span>
                    </td>

                    <td className="size">
                      <span className="size-text">{order.size || ""}</span>
                    </td>

                    <td className="special-order-date">
                      {formatDate(order.created_at)}
                    </td>


                    <td className="special-order-actions1">
                      <Link
                        to={`/Dashboard/special-orders/${order.id}`}
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

export default SpecialOrderShow;
