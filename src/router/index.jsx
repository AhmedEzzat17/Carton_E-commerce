import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePageContent from "../components/HomePageContent";
import ProductPage from "../pages/ProductPage";
import FullRecentProductsPage from "../pages/FullRecentProductsPage";
import CategoryProductsPage from "../pages/CategoryProductsPage";
import ShoppingCartSection from "../pages/ShoppingCartSection";
import WishListSection from "../pages/WishListSection";
import UserShow from "../A-Dashboard/users/UserShow";
import UserEdit from "../A-Dashboard/users/UserEdit";
import UserCreate from "../A-Dashboard/users/UserCreate";
import CategoryShow from "../A-Dashboard/categories/CategoryShow";
import CategoryEdit from "../A-Dashboard/categories/CategoryEdit";
import CategoryCreate from "../A-Dashboard/categories/CategoryCreate";
import ProductCreate  from "../A-Dashboard/products/ProductCreate";
import ProductEdit from "../A-Dashboard/products/ProductEdit";
import ProductShow from "../A-Dashboard/products/ProductShow";
import OrderShow from "../A-Dashboard/orders/OrderShow";
import OrderDetails from "../A-Dashboard/orders/OrderDetails";
import SpecialOrderShow from "../A-Dashboard/specialRequest/SpecialOrderShow";
import SpecialOrderDetails from "../A-Dashboard/specialRequest/SpecialOrderDetails";
import PaymentmMethod from "../pages/PaymentmMethod";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "../pages/ErrorPage";
import Profile from "../pages/profile";
const Dashboard = lazy(() => import("../A-Dashboard/Dashboard"));

const AppRoutes = () => (
  <Routes>
    {/* صفحات عامة */}
    <Route path="/" element={<HomePageContent />} />
    <Route path="/productPage/:id" element={<ProductPage />} />
    <Route
      path="/FullRecentProductsPage"
      element={<FullRecentProductsPage />}
    />
    <Route path="/category/:id" element={<CategoryProductsPage />} />
    <Route path="/ShoppingCartSection" element={<ShoppingCartSection />} />
    <Route path="/WishListSection" element={<WishListSection />} />
    <Route path="/Profile" element={<Profile />} />
    {/* <Route path="/PaymentmMethod" element={<PaymentmMethod />} /> */}
    {/* صفحة الدفع لازم تسجيل دخول */}
    <Route element={<PrivateRoute />}>
      <Route path="/PaymentmMethod" element={<PaymentmMethod />} />
    </Route>
    <Route path="/*" element={<ErrorPage />} />
    <Route
      path="/Favorites"
      element={
        <Suspense fallback={<div>جارٍ التحميل...</div>}>
          {React.createElement(
            require("../components/Favorites/FavoritesPage").default
          )}
        </Suspense>
      }
    />

    {/* حماية لوحة التحكم وكل صفحاتها للمستخدمين بصلاحية "admin" فقط */}
    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
      {/* دعم كلا من Dashboard و dashboard */}
      <Route
        path="/Dashboard"
        element={
          <Suspense fallback={<div>جارٍ التحميل...</div>}>
            <Dashboard />        
          </Suspense>
        }
      >
        {/* صفحات لوحة التحكم الفرعية */}
        <Route path="users" element={<UserShow />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/edit/:id" element={<UserEdit />} />
        <Route path="categories" element={<CategoryShow />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/edit/:id" element={<CategoryEdit />} />
        <Route path="products" element={<ProductShow />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/edit/:id" element={<ProductEdit />} />
        <Route path="orders" element={<OrderShow />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="special-orders" element={<SpecialOrderShow />} />
        <Route path="special-orders/:id" element={<SpecialOrderDetails />} />
      </Route>
      
      {/* إعادة توجيه dashboard بحرف صغير إلى Dashboard بحرف كبير */}
      <Route 
        path="/dashboard/*" 
        element={<Navigate to={window.location.pathname.replace('/dashboard', '/Dashboard')} replace />} 
      />
    </Route>
  </Routes>
);

export default AppRoutes;
