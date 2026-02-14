import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Tab, Nav, Dropdown, Button } from "react-bootstrap";
import logoImg from "../../assets/images/resize_image_686fe7da13ce4.png";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { CartWishlistContext } from "../../App";

const Navbar = () => {
  // Refs
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchContainerRef = useRef(null);
  const [showCart, setShowCart] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("الصفحة الرئيسية");

  const { cartItems, wishlistItems, addToCart, removeFromWishlist } =
    useContext(CartWishlistContext);

  // مستمع لتصفير السلة
  useEffect(() => {
    const handleCartCleared = () => {
      console.log("🔔 Navbar: تم استلام إشارة cartCleared");
      // العداد سيتحدث تلقائياً لأن cartItems من Context
    };

    window.addEventListener("cartCleared", handleCartCleared);
    return () => window.removeEventListener("cartCleared", handleCartCleared);
  }, []);

  // جلب الفئات من الـ API
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        // استخدام axios مباشرة بدلاً من productService
        const response = await axios.get(
          `https://myappapi.fikriti.com/api/v1/interface/products`,
          {
            params: {
              type: "categories",
            },
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        console.log("API Response:", response.data);
        if (response.data?.status && Array.isArray(response.data.data?.data)) {
          setCategories(response.data.data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Categories fetch error:", error);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // تحديد العنصر النشط بناءً على المسار الحالي عند التحميل
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    // إذا كنا في صفحة غير الصفحة الرئيسية، لا نعرض active
    if (currentPath !== "/") {
      setActiveNavItem(""); // إخفاء الـ active
      return;
    }

    // فقط عند التحميل الأول في الصفحة الرئيسية، إذا كان هناك hash في الرابط
    if (currentHash) {
      if (currentHash === "#one") {
        setActiveNavItem("ما نزل مؤخرأ");
      } else if (currentHash === "#categories") {
        setActiveNavItem("الأقسام");
      } else if (currentHash === "#faq-section-wrapper") {
        setActiveNavItem("الأسئلة الشائعة");
      }
    } else {
      setActiveNavItem("الصفحة الرئيسية");
    }
    // بعد كده الـ scroll spy هيتولى المهمة
  }, []);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Escape") {
        setShowSearchPopup(false);
        setShowLoginModal(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, []);

  // Scroll detection for mobile navbar changes
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // منطق الهيستريسيس لمنع التبديل السريع في المنتصف
      if (scrollTop > 50 && !isScrolled) {
        // الانتقال من الحالة العلوية للسفلية عند 50 بكسل
        setIsScrolled(true);
      } else if (scrollTop < 30 && isScrolled) {
        // العودة من السفلية للعلوية عند 30 بكسل فقط
        setIsScrolled(false);
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Scroll Spy - تتبع القسم النشط أثناء التمرير
  useEffect(() => {
    const handleScrollSpy = () => {
      // التحقق من أننا في الصفحة الرئيسية فقط
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        setActiveNavItem(""); // إخفاء الـ active في الصفحات الأخرى
        return;
      }

      const scrollPosition = window.scrollY + 150; // offset للنافبار

      // تحديد الأقسام المراد تتبعها
      const sections = [
        { id: "one", name: "ما نزل مؤخرأ" },
        { id: "categories", name: "الأقسام" },
        { id: "faq-section-wrapper", name: "الأسئلة الشائعة" },
      ];

      // إذا كنا في أعلى الصفحة
      if (window.scrollY < 60) {
        setActiveNavItem("الصفحة الرئيسية");
        return;
      }

      // البحث عن القسم النشط
      let currentSection = "الصفحة الرئيسية";

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            currentSection = section.name;
            break;
          }
        }
      }

      setActiveNavItem(currentSection);
    };

    // تشغيل عند التحميل
    handleScrollSpy();

    // تشغيل عند التمرير
    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  useEffect(() => {
    const body = document.body;
    if (showLoginModal) {
      body.classList.add("dimmed-bg");
      // منع scroll على الصفحة لما Modal يكون مفتوح
      body.style.overflow = "hidden";
    } else {
      body.classList.remove("dimmed-bg");
      // إرجاع scroll للصفحة لما Modal يتقفل
      body.style.overflow = "auto";
    }
  }, [showLoginModal]);

  // استمع لحدث فتح نافذة تسجيل الدخول من PrivateRoute
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setShowLoginModal(true);
    };

    window.addEventListener("openLoginModal", handleOpenLoginModal);

    return () => {
      window.removeEventListener("openLoginModal", handleOpenLoginModal);
    };
  }, []);

  // Debounced search function to avoid making API calls on every keystroke
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim().length === 0) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      // Fetch products from the API using the new endpoint
      try {
        const response = await axios.get(
          `https://myappapi.fikriti.com/api/v1/interface/products`,
          {
            params: {
              search: query,
              perPage: 10,
            },
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        if (response.data?.status && response.data?.data?.data) {
          const products = response.data.data.data.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            main_image: product.images
              ? `https://myappapi.fikriti.com/${product.images}`
              : null,
            images:
              product.productimages && product.productimages.length > 0
                ? product.productimages.map((img) => ({
                    full_url: `https://myappapi.fikriti.com/${img.url}`,
                    alt: img.alt_text,
                  }))
                : [],
          }));
          setSearchSuggestions(products);
        } else {
          setSearchSuggestions([]);
        }
        setShowSuggestions(true);
        setIsSearchExpanded(true);
      } catch (error) {
        console.error("Search API Error:", error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300), // 300ms delay
    [],
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    window.location.href = `/productPage/${product.id}`;
  };
  const cancelLogout = () => {
    // user clicked "No" -> just close modal
    setShowLogoutModal(false);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    setShowSearchPopup(true);
  };

  // إغلاق القائمة المنسدلة عند النقر في أي مكان بالصفحة
  useEffect(() => {
    const handleClickAnywhere = (event) => {
      const menu = document.querySelector(".user-dropdown-custom");
      const button = document.getElementById("userDropdown");

      // إذا كان النقر خارج القائمة وخارج الزر
      if (
        menu &&
        button &&
        !menu.contains(event.target) &&
        !button.contains(event.target)
      ) {
        menu.classList.remove("show");
      }
    };

    // إضافة مستمع الأحداث للصفحة كاملة
    document.addEventListener("click", handleClickAnywhere);

    // تنظيف مستمع الأحداث عند إلغاء التثبيت
    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  // Add event listener for logout from other components
  React.useEffect(() => {
    const handleShowLogoutModal = () => {
      setShowLogoutModal(true);
    };

    document.addEventListener("showLogoutModal", handleShowLogoutModal);

    return () => {
      document.removeEventListener("showLogoutModal", handleShowLogoutModal);
    };
  }, []);

  // دالة إغلاق القائمة الجانبية وتحديث العنصر النشط
  const closeSidebar = (navItem = null) => {
    const offcanvasElement = document.getElementById("bdNavbar");
    if (offcanvasElement) {
      const offcanvas =
        window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
      if (offcanvas) {
        offcanvas.hide();
      }
    }
    // تحديث العنصر النشط إذا تم تمرير اسم العنصر
    if (navItem) {
      setActiveNavItem(navItem);
    }
  };

  // دالة إغلاق القائمة المنسدلة للمستخدم
  const closeUserDropdown = () => {
    setShowUserDropdown(false);
  };

  // دالة إغلاق القائمة المخصصة للمستخدم
  const closeCustomDropdown = () => {
    const menu = document.querySelector(".user-dropdown-custom");
    if (menu) {
      menu.classList.remove("show");
    }
  };
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    // يمكنك إضافة أي إعادة توجيه هنا إذا أردت
  };

  const LoginRegisterModal = () => (
    <Modal
      show={showLoginModal}
      onHide={() => setShowLoginModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>تسجيل الدخول / إنشاء حساب</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="login">
          <Nav variant="tabs" className="mb-3 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="login">تسجيل الدخول</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register">إنشاء حساب</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="login">
              <Login />
            </Tab.Pane>
            <Tab.Pane eventKey="register">
              <Register />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );

  const [show, setShow] = useState(false);

  return (
    <>
      {/* Search Popup */}
      {showSearchPopup && (
        <div
          className="search-popup is-visible"
          onClick={(e) => {
            if (
              !e.target.closest(".search-popup-container") ||
              e.target.closest(".search-popup-close")
            ) {
              setShowSearchPopup(false);
            }
          }}
        >
          <div className="search-popup-container">
            <form role="search" method="get" className="search-form" action="">
              <input
                type="search"
                id="search-popup"
                className="search-field"
                placeholder="اكتب هنا "
                name="s"
                autoFocus
              />
              <button type="submit" className="search-submit">
                <i className="bx bx-search"></i>
              </button>
            </form>
            <h5 className="cat-list-title">تصفح الفئات</h5>
            <ul className="cat-list">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id || cat._id} className="cat-list-item">
                    <a href={cat.link || "#"}>{cat.name}</a>
                  </li>
                ))
              ) : (
                <li className="cat-list-item">لا توجد فئات متاحة</li>
              )}
              <li className="cat-list-item">
                {isLoggedIn ? (
                  <button
                    className="btn btn-danger fw-bold"
                    onClick={handleLogoutClick}
                  >
                    تسجيل الخروج{" "}
                    <i
                      className="bx bx-log-out me-1"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-link fw-bold"
                    onClick={handleLoginClick}
                    style={{ textDecoration: "none" }}
                  >
                    تسجيل حساب{" "}
                    <i
                      className="bx bx-user me-1"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* مودال تسجيل الدخول يظهر دائماً فوق الصفحة */}
      {showLoginModal && <LoginRegisterModal />}
      <header id="header" className="site-header sticky-top">
        <div className="top-info border-bottom d-none d-md-block">
          <div className="container-fluid top-nav">
            <div className="row g-0" data-aos="fade-down" data-aos-once="true">
              <div className="col-md-4">
                <p className="fs-6 my-2 text-center">
                  هل تحتاج إلى مساعدة؟ اتصل بنا <a href="#">000000</a>
                </p>
              </div>
              <div className="col-md-4 border-start border-end">
                <p className="fs-6 my-2 text-center">
                  خصم الصيف 60%!{" "}
                  <a className="text-decoration-underline" href="index.html">
                    تسوق الآن
                  </a>
                </p>
              </div>
              <div className="col-md-4">
                <p className="fs-6 my-2 text-center">
                  توصيل خلال 2-3 أيام عمل وإرجاع مجاني (تجربه)
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav
          id="header-nav"
          className={`navbar navbar-expand-lg ${isScrolled ? "navbar-scrolled" : ""}`}
        >
          <div className="container">
            <a
              className={`navbar-brand res-logo ${isScrolled ? "logo-hidden" : ""}`}
              href="/"
            >
              <img src={logoImg} className="logo" alt="Logo" />
            </a>

            <button
              className={`navbar-toggler d-flex d-lg-none order-3 p-2 ${isScrolled ? "hamburger-hidden" : ""}`}
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#bdNavbar"
              aria-controls="bdNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bx bx-menu" style={{ fontSize: "24px" }}></i>
            </button>

            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="bdNavbar"
              aria-labelledby="bdNavbarOffcanvasLabel"
            >
              <div className="offcanvas-header px-4 pb-0">
                <a className="navbar-brand res-logo" href="/">
                  <img src={logoImg} className="logo" alt="Logo" />
                </a>
                <button
                  type="button"
                  className="btn-close btn-close-black"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  data-bs-target="#bdNavbar"
                ></button>
              </div>
              <div
                className="offcanvas-body"
                data-aos="fade-down"
                data-aos-once="true"
              >
                <ul
                  id="navbar"
                  className="navbar-nav text-uppercase justify-content-start justify-content-lg-start align-items-start align-items-lg-center flex-grow-1"
                >
                  <li className="nav-item">
                    <a
                      className={`nav-link me-3 ${activeNavItem === "الصفحة الرئيسية" ? "active" : ""}`}
                      href="/"
                      onClick={() => closeSidebar("الصفحة الرئيسية")}
                    >
                      الصفحة الرئيسية
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link me-3 ${activeNavItem === "ما نزل مؤخرأ" ? "active" : ""}`}
                      href="/#one"
                      onClick={() => closeSidebar("ما نزل مؤخرأ")}
                    >
                      ما نزل مؤخرأ
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link me-3 ${activeNavItem === "الأقسام" ? "active" : ""}`}
                      href="/#categories"
                      onClick={() => closeSidebar("الأقسام")}
                    >
                      الأقسام
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link me-3 ${activeNavItem === "الأسئلة الشائعة" ? "active" : ""}`}
                      href="/#faq-section-wrapper"
                      onClick={() => closeSidebar("الأسئلة الشائعة")}
                    >
                      الأسئلة الشائعة
                    </a>
                  </li>

                  {/* {!isLoggedIn ? null : (
                    <li className="nav-item">
                      <a className="nav-link me-3" href="#" onClick={handleLogoutClick}>
                        تسجيل الخروج
                      </a>
                    </li>
                  )} */}

                  {/* <Dropdown as="li" className="nav-item">
                    <Dropdown.Toggle
                      as="a"
                      className="nav-link me-3"
                      href="/#best-selling-items"
                    >
                      المستلزمات
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="animate slide border">
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات الأكياس
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات تغليف الملابس
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات التغليف
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات الشحن
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات الاطعمه والمشروبات
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات الأعياد وحفلات الميلاد
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات العطور
                      </Dropdown.Item>
                      <Dropdown.Item href="index.html" className="fw-light">
                        مستلزمات الأكسسوارات
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> */}

                  {/* <li className="nav-item">
                    <a className="nav-link me-3" href="#contact-2">
                      تواصل معنا
                    </a>
                  </li> */}
                </ul>

                {/* شريط البحث الرئيسي */}
                <div className="d-flex align-items-center d-none d-lg-flex">
                  <div
                    className="search-container"
                    ref={searchContainerRef}
                    style={{
                      maxWidth: isSearchExpanded ? "500px" : "500px",
                      // overflow: "hidden",
                      transition: "max-width 0.9s",
                      flexGrow: 1,
                    }}
                  >
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control search-input"
                        placeholder="ابحث عن المنتجات..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                          padding: "12px 12px 12px 20px",
                          borderRadius: "30px",
                          border: "2px solid #f1f0f6",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                          width: "100%",
                          color: "#000",
                        }}
                      />
                      <button
                        className="btn btn-primary position-absolute"
                        style={{
                          left: "0px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          padding: "17px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                      >
                        <i
                          className="bx bx-search"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </button>

                      {showSuggestions && (
                        <div
                          className="suggestions-dropdown position-absolute w-100 bg-white mt-1"
                          style={{
                            borderRadius: "10px",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                            zIndex: 1000,
                            maxHeight: "300px",
                            overflowY: "auto",
                          }}
                        >
                          {searchSuggestions.length > 0 ? (
                            searchSuggestions
                              .filter(
                                (item) => typeof item === "object" && item.name,
                              )
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="suggestion-item p-3 border-bottom"
                                  style={{
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                  onClick={() => handleSuggestionClick(item)}
                                >
                                  <img
                                    src={
                                      item.main_image ||
                                      (Array.isArray(item.images) &&
                                        item.images[0]?.full_url) ||
                                      (typeof item.images === "string" &&
                                      item.images
                                        ? `https://myappapi.fikriti.com/${item.images}`
                                        : "https://via.placeholder.com/32x32?text=No+Image")
                                    }
                                    alt={item.name}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                      marginLeft: "8px",
                                    }}
                                  />
                                  {item.name}{" "}
                                  {item.slug && (
                                    <span
                                      className="#"
                                      style={{ color: "gray" }}
                                    >
                                      ({item.slug})
                                    </span>
                                  )}
                                </div>
                              ))
                          ) : (
                            <div
                              className="suggestion-item p-3  text-center"
                              style={{ cursor: "default" }}
                            >
                              <i className="me-2"></i> لا توجد نتائج
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="user-items d-flex">
                  <ul className="d-flex justify-content-end align-items-center list-unstyled mb-0 fs-5 mt-3">
                    <li className="search-item pe-2"></li>

                    {/* wishList */}
                    <Dropdown
                      as="li"
                      className="wishlist-dropdown pe-3"
                      show={show}
                      onToggle={(isOpen) => setShow(isOpen)}
                    >
                      <Dropdown.Toggle
                        as="a"
                        className="dropdown-toggle ps-3"
                        onClick={() => setShow(!show)}
                        id="wishlistDropdownToggle"
                      >
                        <i
                          className="bx bx-heart"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        className="animate slide dropdown-menu-end dropdown-menu-lg-end p-3 mt-5"
                        onClick={() => setShow(false)} // ✅ يغلق القائمة عند أي ضغطة داخلية
                      >
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                          <span>قائمة رغباتك</span>
                        </h4>
                        <ul
                          className="list-group mb-3 p-0 text-end"
                          style={{ maxHeight: "260px", overflowY: "auto" }}
                        >
                          {wishlistItems.length === 0 ? (
                            <li className="list-group-item text-center">
                              لا توجد منتجات في المفضلة
                            </li>
                          ) : (
                            wishlistItems.map((item) => (
                              <li
                                key={item.id}
                                className="list-group-item bg-transparent d-flex justify-content-between lh-sm"
                              >
                                <div>
                                  <h5>
                                    <a href="index.html">{item.name}</a>
                                  </h5>
                                  <small>سعر: {item.price} ر.س</small>
                                  <a
                                    href="#"
                                    className="d-block fw-medium text-capitalize mt-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      addToCart(item);
                                      removeFromWishlist(item);
                                    }}
                                  >
                                    إضافة إلى السلة
                                  </a>
                                </div>
                                {/* صورة المنتج في المفضلة */}
                                {(() => {
                                  let imgSrc =
                                    "https://via.placeholder.com/60x60?text=No+Image";
                                  if (item.main_image) {
                                    imgSrc = item.main_image;
                                  } else if (
                                    Array.isArray(item.images) &&
                                    item.images.length > 0
                                  ) {
                                    imgSrc = item.images[0]?.full_url || imgSrc;
                                  } else if (
                                    typeof item.images === "string" &&
                                    item.images
                                  ) {
                                    imgSrc = `https://myappapi.fikriti.com/${item.images}`;
                                  }
                                  return (
                                    <img
                                      src={imgSrc}
                                      alt={item.name}
                                      style={{ width: 30, height: 30 }}
                                    />
                                  );
                                })()}
                              </li>
                            ))
                          )}
                        </ul>
                        <div className="d-flex flex-wrap justify-content-center">
                          <Link
                            to="/Favorites"
                            className="w-100 btn btn-dark mb-1"
                            onClick={() => {
                              setShow(false);
                              closeSidebar();
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            عرض قائمة رغباتك
                          </Link>
                          {/* <Link
                            to="/"
                            className="w-100 btn btn-primary"
                            onClick={() => setShow(false)} // أيضاً هنا
                          >
                            الذهاب إلى الدفع
                          </Link> */}
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* cart */}
                    <Dropdown
                      as="li"
                      className="cart-dropdown ms-3 p-0"
                      show={showCart}
                      onToggle={(isOpen) => setShowCart(isOpen)}
                    >
                      <Dropdown.Toggle
                        as="a"
                        className="dropdown-toggle"
                        id="cartDropdownToggle"
                        onClick={() => setShowCart(!showCart)}
                      >
                        <i
                          className="bx bx-cart"
                          style={{ fontSize: "25px" }}
                        ></i>
                        <span
                          style={{
                            position: "absolute",
                            top: "-11px",
                            left: "7px",
                            background: "var(--accent-color)",
                            color: "white",
                            borderRadius: "50%",
                            padding: "3px 5px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            lineHeight: "1",
                          }}
                        >
                          {cartItems.length}
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        className="animate slide dropdown-menu-end dropdown-menu-lg-end p-3 mt-5"
                        onClick={() => setShowCart(false)} // ✅ يغلق عند الضغط على أي عنصر
                      >
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                          <span>سلة التسوق الخاصة بك</span>
                        </h4>
                        <ul
                          className="list-group mb-3 p-0 text-end"
                          style={{ maxHeight: "260px", overflowY: "auto" }}
                        >
                          {cartItems.length === 0 ? (
                            <li className="list-group-item text-center">
                              لا توجد منتجات في السلة
                            </li>
                          ) : (
                            cartItems.map((item) => (
                              <li
                                key={item.id}
                                className="list-group-item bg-transparent d-flex justify-content-between lh-sm"
                              >
                                <div>
                                  <h5>
                                    <a href="index.html">{item.name}</a>
                                  </h5>
                                  <small>سعر: {item.price} ر.س</small>
                                </div>
                                {/* صورة المنتج في السلة */}
                                {(() => {
                                  let imgSrc =
                                    "https://via.placeholder.com/60x60?text=No+Image";
                                  if (item.main_image) {
                                    imgSrc = item.main_image;
                                  } else if (
                                    Array.isArray(item.images) &&
                                    item.images.length > 0
                                  ) {
                                    imgSrc = item.images[0]?.full_url || imgSrc;
                                  } else if (
                                    typeof item.images === "string" &&
                                    item.images
                                  ) {
                                    imgSrc = `https://myappapi.fikriti.com/${item.images}`;
                                  }
                                  return (
                                    <img
                                      src={imgSrc}
                                      alt={item.name}
                                      style={{ width: 30, height: 30 }}
                                    />
                                  );
                                })()}
                              </li>
                            ))
                          )}
                        </ul>
                        <div className="d-flex flex-wrap justify-content-center">
                          <Link
                            to="/ShoppingCartSection"
                            className="w-100 btn btn-dark mb-1"
                            onClick={() => {
                              setShowCart(false);
                              closeSidebar();
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            عرض السلة
                          </Link>
                          <Link
                            to="/PaymentmMethod"
                            className="w-100 btn btn-primary"
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              setShowCart(false);
                              closeSidebar();
                            }}
                          >
                            الذهاب إلى الدفع
                          </Link>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* user */}
                    <li className="pe-1 logn" style={{ position: "relative" }}>
                      {isLoggedIn ? (
                        <div className="user-profile-container">
                          <button
                            ref={buttonRef}
                            className="user-profile-btn-custom"
                            id="userDropdown"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const menu = document.querySelector(
                                ".user-dropdown-custom",
                              );
                              menu.classList.toggle("show");
                            }}
                            aria-expanded="false"
                          >
                            <span>مرحباً</span>
                            <span className="user-profile-name">
                              {(() => {
                                try {
                                  const userData = JSON.parse(
                                    localStorage.getItem("user"),
                                  );
                                  const userName =
                                    userData?.user?.name || "المستخدم";
                                  return userName.split(" ")[0].length <= 10
                                    ? userName.split(" ")[0]
                                    : `${userName.substring(0, 10)}...`;
                                } catch {
                                  return "المستخدم";
                                }
                              })()}
                            </span>
                            <i className="bx bx-user"></i>
                          </button>
                          <div
                            ref={dropdownRef}
                            className="user-dropdown-custom"
                            id="userDropdownMenu"
                          >
                            <div className="user-dropdown-header">
                              <i className="bx bx-user ms-2"></i>
                              <span>
                                {(() => {
                                  try {
                                    const userData = JSON.parse(
                                      localStorage.getItem("user"),
                                    );
                                    return userData?.user?.name || "المستخدم";
                                  } catch {
                                    return "المستخدم";
                                  }
                                })()}
                              </span>
                            </div>
                            <div className="user-dropdown-divider"></div>
                            <Link
                              className="user-dropdown-item"
                              to="/Profile"
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                closeCustomDropdown();
                                closeUserDropdown();
                                closeSidebar();
                              }}
                            >
                              <i className="bx bx-user"></i> الملف الشخصي
                            </Link>
                            {/* <Link className="user-dropdown-item" to="/orders">
                              <i className="bx bx-package"></i> طلباتي
                            </Link>
                            <Link className="user-dropdown-item" to="/wishlist">
                              <i className="bx bx-heart"></i> قائمة الرغبات
                            </Link> */}
                            <div className="user-dropdown-divider"></div>
                            <button
                              className="user-dropdown-item text-danger"
                              onClick={(e) => {
                                handleLogoutClick(e);
                                closeCustomDropdown();
                                closeUserDropdown();
                                closeSidebar();
                              }}
                            >
                              <i className="bx bx-log-out"></i> تسجيل خروج
                            </button>
                          </div>
                        </div>
                      ) : (
                        <a
                          href="#"
                          onClick={handleLoginClick}
                          className="login-btn-custom d-none d-lg-inline-flex"
                        >
                          <span>تسجيل دخول</span>
                          <i className="bx bx-user"></i>
                        </a>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* Responsive navbar for screens < 991px */}
        <div
          className={`navbar-mobile d-flex d-lg-none w-100 ${isScrolled ? "scrolled" : ""}`}
        >
          <ul className="d-flex align-items-center justify-content-between w-100 mb-0 ">
            {/* user icon - shows when not scrolled */}
            {!isScrolled && (
              <li className="pe-1 logn user-icon-normal">
                {isLoggedIn ? (
                  <Dropdown
                    className="user-dropdown-nav"
                    align="end"
                    show={showUserDropdown}
                    onToggle={setShowUserDropdown}
                  >
                    <Dropdown.Toggle
                      as="a"
                      href="#"
                      className="p-0"
                      style={{ background: "none", border: "none" }}
                    >
                      <span>
                        <i
                          className="bx bx-user"
                          style={{ fontSize: "25px" }}
                        ></i>
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="user-dropdown-menu">
                      <Dropdown.Item
                        as={Link}
                        to="/Profile"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          closeUserDropdown();
                          closeSidebar();
                        }}
                      >
                        <i className="bx bx-user me-2"></i> الملف الشخصي
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={(e) => {
                          e.preventDefault();
                          setShowLogoutModal(true);
                          closeUserDropdown();
                          closeSidebar();
                        }}
                        className="text-danger"
                      >
                        <i className="bx bx-log-out me-2"></i> تسجيل الخروج
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <a href="#" onClick={handleLoginClick}>
                    <span>
                      <i
                        className="bx bx-user"
                        style={{ fontSize: "25px" }}
                      ></i>
                    </span>
                  </a>
                )}
              </li>
            )}

            {/* hamburger menu - shows when scrolled in place of user icon */}
            {isScrolled && (
              <li className="pe-1 mobile-hamburger-menu-scrolled">
                <button
                  className="navbar-toggler d-flex p-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#bdNavbar"
                  aria-controls="bdNavbar"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  style={{ border: "none", background: "none" }}
                >
                  <i className="bx bx-menu" style={{ fontSize: "25px" }}></i>
                </button>
              </li>
            )}

            {/* search */}
            <li
              className={`mobile-search-container ${isScrolled ? "scrolled" : "full-width"}`}
            >
              <div
                className="navbar-mobile-search"
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="ابحث هنا..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    padding: "12px 15px 12px 20px",
                    borderRadius: "30px",
                    border: "2px solid #f1f0f6",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    width: "100%",
                    color: "#000",
                  }}
                />
                <button
                  className="btn btn-primary position-absolute"
                  style={{
                    left: "5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                >
                  <i className="bx bx-search" style={{ fontSize: "20px" }}></i>
                </button>

                {showSuggestions && (
                  <div
                    className="suggestions-dropdown position-absolute w-100 bg-white mt-1"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {searchSuggestions.length > 0 ? (
                      searchSuggestions
                        .filter((item) => typeof item === "object" && item.name)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="suggestion-item p-3 border-bottom"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <img
                              src={
                                item.main_image ||
                                (Array.isArray(item.images) &&
                                  item.images[0]?.full_url) ||
                                (typeof item.images === "string" && item.images
                                  ? `https://myappapi.fikriti.com/${item.images}`
                                  : "https://via.placeholder.com/32x32?text=No+Image")
                              }
                              alt={item.name}
                              style={{
                                width: 32,
                                height: 32,
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginLeft: "8px",
                              }}
                            />
                            {item.name}{" "}
                            {item.slug && (
                              <span className="#" style={{ color: "gray" }}>
                                ({item.slug})
                              </span>
                            )}
                          </div>
                        ))
                    ) : (
                      <div
                        className="suggestion-item p-3  text-center"
                        style={{ cursor: "default" }}
                      >
                        <i className="me-2"></i> لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>

            {/* wishList */}
            <li className="pe-2">
              <Dropdown
                as="span"
                className="wishlist-dropdown-alt"
                show={show}
                onToggle={(isOpen) => setShow(isOpen)}
              >
                <Dropdown.Toggle
                  as="a"
                  className="dropdown-toggle-alt ps-3"
                  onClick={() => setShow(!show)}
                  id="wishlistDropdownToggleAlt"
                >
                  <i className="bx bx-heart" style={{ fontSize: "25px" }}></i>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="animate slide dropdown-menu-end dropdown-menu-mobile p-3 mt-5"
                  onClick={() => setShow(false)}
                >
                  <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span>قائمة رغباتك</span>
                  </h4>
                  <ul
                    className="list-group mb-3"
                    style={{ maxHeight: "260px", overflowY: "auto" }}
                  >
                    {wishlistItems.length === 0 ? (
                      <li className="list-group-item text-center">
                        لا توجد منتجات في المفضلة
                      </li>
                    ) : (
                      wishlistItems.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item bg-transparent d-flex justify-content-between lh-sm"
                        >
                          <div>
                            <h5>
                              <a href="index.html">{item.name}</a>
                            </h5>
                            <small>سعر: {item.price} ر.س</small>
                            <a
                              href="#"
                              className="d-block fw-medium text-capitalize mt-2"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(item);
                                removeFromWishlist(item);
                              }}
                            >
                              إضافة إلى السلة
                            </a>
                          </div>
                          {item.images && (
                            <img
                              src={`https://myappapi.fikriti.com/${item.images}`}
                              alt={item.name}
                              style={{ width: 30, height: 30 }}
                            />
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="d-flex flex-wrap justify-content-center">
                    <Link
                      to="/WishListSection"
                      className="w-100 btn btn-dark mb-1"
                      onClick={() => {
                        setShow(false);
                        closeSidebar();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      عرض قائمة رغباتك
                    </Link>
                    {/* <Link
                      to="/"
                      className="w-100 btn btn-primary"
                      onClick={() => setShow(false)}
                    >
                      الذهاب إلى الدفع
                    </Link> */}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </li>

            {/* cart */}
            <li>
              <Dropdown
                as="span"
                className="cart-dropdown-alt"
                show={showCart}
                onToggle={(isOpen) => setShowCart(isOpen)}
              >
                <Dropdown.Toggle
                  as="a"
                  className="dropdown-toggle-alt"
                  id="cartDropdownToggleAlt"
                  onClick={() => setShowCart(!showCart)}
                >
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <i className="bx bx-cart" style={{ fontSize: "25px" }}></i>
                    <span
                      style={{
                        position: "absolute",
                        top: "-11px",
                        left: "7px",
                        background: "var(--accent-color)",
                        color: "white",
                        borderRadius: "50%",
                        padding: "3px 5px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        lineHeight: "1",
                      }}
                    >
                      {cartItems.length}
                    </span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="animate slide dropdown-menu-end dropdown-menu-mobile p-3 mt-5"
                  onClick={() => setShowCart(false)}
                >
                  <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span>سلة التسوق الخاصة بك</span>
                  </h4>

                  <ul
                    className="list-group mb-3"
                    style={{ maxHeight: "260px", overflowX: "auto" }}
                  >
                    {cartItems.length === 0 ? (
                      <li className="list-group-item text-center">
                        لا توجد منتجات في السلة
                      </li>
                    ) : (
                      cartItems.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item bg-transparent d-flex justify-content-between lh-sm"
                        >
                          <div>
                            <h5>
                              <a href="index.html">{item.name}</a>
                            </h5>
                            <small>سعر: {item.price} ر.س</small>
                          </div>
                          {/* صورة المنتج في السلة */}
                          {(() => {
                            let imgSrc =
                              "https://via.placeholder.com/60x60?text=No+Image";
                            if (item.main_image) {
                              imgSrc = item.main_image;
                            } else if (
                              Array.isArray(item.images) &&
                              item.images.length > 0
                            ) {
                              imgSrc = item.images[0]?.full_url || imgSrc;
                            } else if (
                              typeof item.images === "string" &&
                              item.images
                            ) {
                              imgSrc = `https://myappapi.fikriti.com/${item.images}`;
                            }
                            return (
                              <img
                                src={imgSrc}
                                alt={item.name}
                                style={{ width: 30, height: 30 }}
                              />
                            );
                          })()}
                        </li>
                      ))
                    )}
                  </ul>

                  <div className="d-flex flex-wrap justify-content-center">
                    <Link
                      to="/ShoppingCartSection"
                      className="w-100 btn btn-dark mb-1"
                      onClick={() => {
                        setShowCart(false);
                        closeSidebar();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      عرض السلة
                    </Link>
                    <Link
                      to="/PaymentmMethod"
                      className="w-100 btn btn-primary"
                      onClick={() => {
                        setShowCart(false);
                        closeSidebar();
                      }}
                    >
                      الذهاب إلى الدفع
                    </Link>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </header>

      {/* مودال تأكيد تسجيل الخروج */}
      <Modal
        show={showLogoutModal}
        onHide={cancelLogout}
        centered
        backdrop={true} // يخلي الضغط برا يقفل المودال
        keyboard={true}
        dialogClassName="custom-logout-modal"
      >
        <Modal.Body className="text-center p-4">
          {/* الأيقونة */}
          <div
            className="d-flex align-items-center justify-content-center mb-3"
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#fcebea",
              margin: "0 auto",
            }}
          >
            <i
              className="bx bx-log-out-circle"
              style={{ fontSize: 40, color: "#d9534f" }}
            ></i>
          </div>

          {/* العنوان */}
          <h5 className="fw-bold mb-2">تسجيل الخروج</h5>

          {/* النص */}
          <p className="small mb-4">
            هل أنت متأكد أنك تريد تسجيل الخروج؟ <br />
            ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.
          </p>

          {/* الأزرار */}
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="outline-secondary"
              onClick={cancelLogout}
              style={{
                borderRadius: "25px",
                minWidth: "130px",
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={confirmLogout}
              style={{
                borderRadius: "25px",
                minWidth: "130px",
              }}
            >
              تسجيل الخروج
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
