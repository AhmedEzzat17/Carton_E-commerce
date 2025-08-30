import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  createContext,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// AOS library
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar/Navbar";
import Billboard from "./components/Billboard/Billboard";
import RecentProducts from "./components/RecentProducts/RecentProducts";
import Categories from "./components/Categories/Categories";
import MostDemandedProducts from "./components/MostDemandedProducts/MostDemandedProducts";
import Features from "./components/Features/Features";
import Testimonials from "./components/Testimonials/Testimonials";
import FAQSection from "./components/FAQSection/FAQSection";
//import ContactSection from "./components/ContactSection/ContactSection";
import Footer from "./components/Footer/Footer";
import FloatingButtons from "./components/FloatingButtons/FloatingButtons";
import ProductPage from "./pages/ProductPage";
import FullRecentProductsPage from "./pages/FullRecentProductsPage";
import AppRoutes from "./router/index";
const Dashboard = lazy(() => import("./A-Dashboard/Dashboard"));

export const CartWishlistContext = createContext();

function HomePageContent() {
  return (
    <>
      <Billboard />
      <RecentProducts />
      <Categories />
      <MostDemandedProducts title="الأكثر طلباً" />
      <MostDemandedProducts title="مستلزمات الأكياس" />
      <MostDemandedProducts title="مستلزمات التغليف" />
      <MostDemandedProducts title="مستلزمات الأكسسوارات" />
      <Features />
      <Testimonials />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith("/Dashboard");

  return (
    <>
      {!isDashboardPage && <Navbar />}
      <AppRoutes />
      {!isDashboardPage && (
        <>
          <FAQSection />
          {/* <ContactSection /> */}
          <Footer />
          <FloatingButtons />
        </>
      )}
    </>
  );
}

function getLocal(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [cartItems, setCartItems] = useState(() => getLocal("cartItems", []));
  const [wishlistItems, setWishlistItems] = useState(() =>
    getLocal("wishlistItems", [])
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // إذا كان المنتج موجود بالفعل، زد الكمية
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + (product.quantity || 1),
              }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // دالة تحديث كمية المنتج في السلة أو المفضلة
  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (product) => {
    setCartItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromWishlist = (product) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        updateCartQuantity, // توفير الدالة في السياق
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </CartWishlistContext.Provider>
  );
}

export default App;
