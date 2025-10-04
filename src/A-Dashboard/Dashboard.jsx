import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "boxicons/css/boxicons.min.css";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import myImage from "../assets/images/resize_image_687b9e56ea086.png";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // 1. حالة الشريط الجانبي والقوائم المنسدلة
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  // 2. حالة القائمة النشطة
  const [activeMenuItem, setActiveMenuItem] = useState("");

  // 3. حالة نافذة تأكيد تسجيل الخروج
  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false);

  // 4. حالة البحث
  const [searchQuery, setSearchQuery] = useState("");
  const keywords = [
    { name: "المنتجات", icon: "bx bxs-shopping-bag" },
    { name: "العروض", icon: "bx bxs-offer" },
    { name: "المستخدمين", icon: "bx bxs-user" },
    { name: "الطلبات", icon: "bx bxs-cart" },
    { name: "الإعدادات", icon: "bx bxs-cog" },
    { name: "التقارير", icon: "bx bxs-report" },
    { name: "الفئات", icon: "bx bxs-category" },
  ];

  // Effect لتحديد العنصر النشط عند تحميل الصفحة
  useEffect(() => {
    // تفعيل العنصر النشط بناءً على المسار
    const currentPath = window.location.pathname.replace(/\/$/, "");
    let initialActiveItem;
    switch (currentPath) {
      case "/":
      case "/index.html":
        initialActiveItem = "home";
        break;
      case "/committee":
        initialActiveItem = "committees";
        break;
      case "/user":
        initialActiveItem = "users";
        break;
      case "/orders":
        initialActiveItem = "orders";
        break;
      case "/login.html":
        initialActiveItem = "logout";
        break;
      default:
        initialActiveItem = "home";
        break;
    }
    setActiveMenuItem(initialActiveItem);

    // Effect لإغلاق القوائم عند النقر خارجها
    const handleOutsideClick = (e) => {
      // إغلاق قائمة البروفايل إذا كانت مفتوحة والنقر خارجها
      if (
        isProfileDropdownOpen &&
        e.target.closest("#profile-btn") === null &&
        e.target.closest("#profile-dropdown") === null
      ) {
        setIsProfileDropdownOpen(false);
      }
      // إغلاق قائمة الإشعارات إذا كانت مفتوحة والنقر خارجها
      if (
        isNotificationDropdownOpen &&
        e.target.closest("#notification-btn") === null &&
        e.target.closest("#notification-dropdown") === null
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isProfileDropdownOpen, isNotificationDropdownOpen]);

  // الدوال الخاصة بالأحداث
  const handleToggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  const handleToggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen((prev) => !prev);
    setIsNotificationDropdownOpen(false);
  };

  const handleToggleNotificationDropdown = (e) => {
    e.stopPropagation();
    setIsNotificationDropdownOpen((prev) => !prev);
    setIsProfileDropdownOpen(false);
  };

  const handleMenuItemClick = (e, id) => {
    setActiveMenuItem(id);
    // يمكنك إضافة كود التوجيه (مثل navigate(id)) هنا إذا كنت تستخدم React Router
  };

  const handleShowLogoutAlert = (e) => {
    e.preventDefault();
    setIsLogoutAlertVisible(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutAlertVisible(false);
  };
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="App">
      {/* الشريط الجانبي */}
      <section id="sidebar" className={isSidebarHidden ? "hide" : ""}>
        <div className="logo-box">
          <a href="#">
            <img src={myImage} alt="الشعار" className="logo-img" />
          </a>
        </div>

        <ul className="side-menu scroll-hidden">
          <li>
            <Link
              to="/Dashboard/orders"
              onClick={(e) => handleMenuItemClick(e, "home")}
              className={`menu-item ${
                activeMenuItem === "home" ? "active" : ""
              }`}
              id="home"
            >
              <i className="bx bxs-home icon"></i> الرئيسية
            </Link>
          </li>
          <li>
            <Link
              to="/Dashboard/categories"
              onClick={(e) => handleMenuItemClick(e, "committees")}
              className={`menu-item ${
                activeMenuItem === "committees" ? "active" : ""
              }`}
              id="committees"
            >
              <i className="bx bxs-category icon"></i> الأقسام
            </Link>
          </li>
          <li>
            <Link
              to="/Dashboard/products"
              onClick={(e) => handleMenuItemClick(e, "products")}
              className={`menu-item ${
                activeMenuItem === "products" ? "active" : ""
              }`}
              id="products"
            >
              <i className="bx bxs-shopping-bag icon"></i> المنتجات
            </Link>
          </li>
        
          {/* <li>
              <a
                href="/user"
                onClick={(e) => handleMenuItemClick(e, "offers")}
                className={`menu-item ${
                  activeMenuItem === "offers" ? "active" : ""
                }`}
                id="offers"
              >
                <i className="bx bxs-offer icon"></i> العروض
              </a>
            </li> */}
          {/* <li>
              <a
                href="/user"
                onClick={(e) => handleMenuItemClick(e, "brands")}
                className={`menu-item ${
                  activeMenuItem === "brands" ? "active" : ""
                }`}
                id="brands"
              >
                <i className="bx bxs-store icon"></i> جميع البراندات
              </a>
            </li> */}
          <li>
            <Link
              to="/Dashboard/users"
              onClick={() => handleMenuItemClick(null, "users")}
              className={`menu-item ${
                activeMenuItem === "users" ? "active" : ""
              }`}
              id="users"
            >
              <i className="bx bxs-user icon"></i> المستخدمين
            </Link>
          </li>

          {/* <li>
              <a
                href="/user"
                onClick={(e) => handleMenuItemClick(e, "favorites")}
                className={`menu-item ${
                  activeMenuItem === "favorites" ? "active" : ""
                }`}
                id="favorites"
              >
                <i className="bx bxs-heart icon"></i> المفضلات
              </a>
            </li> */}
          <li>
            <Link
              to="/Dashboard/orders"
              onClick={(e) => handleMenuItemClick(e, "orders")}
              className={`menu-item ${
                activeMenuItem === "orders" ? "active" : ""
              }`}
              id="orders"
            >
              <i className="bx bxs-cart icon"></i> الأوردرات
            </Link>

          </li>
          <li>
            <Link
              to="/Dashboard/special-orders"
              onClick={(e) => handleMenuItemClick(e, "special-orders")}
              className={`menu-item ${
                activeMenuItem === "special-orders" ? "active" : ""
              }`}
              id="special-orders"
            >
              <i className="bx bxs-package icon"></i> الطلبات الخاصة
            </Link>

          </li>
          <li>
            <Link
              onClick={()=>{
                window.location.href=("/");
              }}
             
              id="products"
            >
              <i className="bx bxs-shopping-bag icon"></i> الويب
            </Link>
          </li>
          {/* <li>
              <a
                href="/user"
                onClick={(e) => handleMenuItemClick(e, "settings")}
                className={`menu-item ${
                  activeMenuItem === "settings" ? "active" : ""
                }`}
                id="settings"
              >
                <i className="bx bxs-cog icon"></i> الاعدادات
              </a>
            </li> */}
          <li className="logout-list-item">
            <a
              href="login.html"
              onClick={handleShowLogoutAlert}
              className={`menu-item logout-color ${
                activeMenuItem === "logout" ? "active" : ""
              }`}
              id="logout"
            >
              <i className="bx bx-log-out icon"></i> تسجيل الخروج
            </a>
          </li>
        </ul>
      </section>

      {/* شريط التنقل */}
      <section id="content">
        <nav
          className="d-flex align-items-center justify-content-between"
          style={{ padding: "0 20px" }}
        >
          <div className="d-flex align-items-center gap-3">
            <i
              className="bx bx-menu toggle-sidebar"
              style={{ fontSize: "24px", cursor: "pointer" }}
              onClick={handleToggleSidebar}
            ></i>
            <span
              className="dashboard-title"
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "var(--blue)",
              }}
            >
              لوحة التحكم
            </span>
          </div>

          {/* <div className="nav-search">
            <div className="search-container">
              <i className="bx bx-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                id="searchInput"
                placeholder="ابحث هنا..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {searchQuery && (
                <div className="search-suggestions" id="searchSuggestions">
                  {filteredKeywords.length > 0 ? (
                    filteredKeywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="search-suggestion-item"
                        onClick={() => setSearchQuery(keyword.name)}
                      >
                        <i className={keyword.icon}></i>
                        <span>{keyword.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="search-suggestion-item">
                      <i className="bx bx-search-alt"></i>
                      <span>لا توجد نتائج</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div
              className="notification position-relative"
              id="notification-btn"
              style={{ marginLeft: "16px", cursor: "pointer" }}
              onClick={handleToggleNotificationDropdown}
            >
              <i className="bx bx-bell" style={{ fontSize: "24px" }}></i>
              <span
                className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle"
                style={{ fontSize: "10px" }}
              >
                3
              </span>
              {isNotificationDropdownOpen && (
                <div
                  className="notification-dropdown card shadow"
                  id="notification-dropdown"
                  style={{
                    display: "block",
                    position: "absolute",
                    left: "0",
                    top: "50px",
                    minWidth: "340px",
                    maxWidth: "95vw",
                    zIndex: "1000",
                    borderRadius: "16px",
                  }}
                >
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      <a
                        href="#"
                        className="list-group-item list-group-item-action py-3"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i className="bx bxs-bell"></i>
                          <span>تم إضافة لجنة جديدة بنجاح</span>
                        </div>
                        <small className="text-muted">منذ دقيقة</small>
                      </a>
                      <a
                        href="#"
                        className="list-group-item list-group-item-action py-3"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i className="bx bxs-user text-success"></i>
                          <span>تم إضافة مستخدم جديد</span>
                        </div>
                        <small className="text-muted">منذ 5 دقائق</small>
                      </a>
                      <a
                        href="#"
                        className="list-group-item list-group-item-action py-3"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i className="bx bxs-error text-danger"></i>
                          <span>هناك مهمة بحاجة لمراجعتك</span>
                        </div>
                        <small className="text-muted">منذ ساعة</small>
                      </a>
                    </div>
                    <div className="p-2 border-top text-center">
                      <button className="btn btn-sm w-100">كل الإشعارات</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="profile position-relative"
              id="profile-btn"
              style={{ marginRight: "0" }}
              onClick={handleToggleProfileDropdown}
            >
              <img
                src={myImage}
                alt="الصورة"
                className="rounded-circle"
                id="profile-img"
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "cover",
                  border: "2px solid var(--blue)",
                  cursor: "pointer",
                }}
              />
              {isProfileDropdownOpen && (
                <div
                  className="profile-dropdown card shadow"
                  id="profile-dropdown"
                  style={{
                    display: "block",
                    position: "absolute",
                    left: "0",
                    top: "60px",
                    minWidth: "340px",
                    maxWidth: "95vw",
                    zIndex: "1000",
                    borderRadius: "16px",
                  }}
                >
                  <div className="card-body text-center">
                    <img
                      src={myImage}
                      alt="الصورة "
                      className="rounded-circle mb-2"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        border: "2px solid var(--blue)",
                      }}
                    />
                    <h6 className="mb-0">أحمد محمد</h6>
                    <small className="text-muted">مدير النظام</small>
                    <hr />
                    <div className="text-end">
                      <a href="#" className="dropdown-item">
                        الملف الشخصي
                      </a>
                      <a href="#" className="dropdown-item">
                        الإعدادات
                      </a>
                      <a
                        href="#"
                        onClick={handleShowLogoutAlert}
                        className="dropdown-item text-danger"
                        id="profile-logout"
                      >
                        تسجيل الخروج
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> */}
        </nav>

        {/* المحتوى الرئيسي */}
        <main id="main">
          <Outlet />
        </main>
      </section>

      {/* نافذة تأكيد تسجيل الخروج */}
      {isLogoutAlertVisible && (
        <>
          <div className="overlay show" id="overlay"></div>
          <div className="logout-alert show" id="logout-alert">
            <h3>هل أنت متأكد أنك تريد تسجيل الخروج؟</h3>
            <button
              className="logout-yes"
              id="confirm-logout"
              onClick={handleConfirmLogout}
            >
              نعم
            </button>
            <button
              className="logout-no"
              id="cancel-logout"
              onClick={handleCancelLogout}
            >
              لا
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Loader component for Suspense fallback
export function DashboardLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.85)",
        zIndex: 9999,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <div className="dashboard-spinner">
          <style>{`
              .dashboard-spinner {
                width: 80px;
                height: 80px;
                border: 8px solid #e0e0e0;
                border-top: 8px solid #007bff;
                border-radius: 50%;
                animation: dashboard-spin 1.1s linear infinite;
                box-shadow: 0 0 16px #007bff44;
              }
              @keyframes dashboard-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
        </div>
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#007bff",
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        جاري تحميل لوحة التحكم...
      </div>
    </div>
  );
}

export default Dashboard;
