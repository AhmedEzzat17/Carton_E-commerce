import React, { useEffect, useState } from "react";
import Billboard from "./Billboard/Billboard";
import RecentProducts from "./RecentProducts/RecentProducts";
import Categories from "./Categories/Categories";
import MostDemandedProducts from "./MostDemandedProducts/MostDemandedProducts";
import Features from "./Features/Features";
import Testimonials from "./Testimonials/Testimonials";
import categoryService from "../services/interface/categoryService";

export default function HomePageContent() {
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    categoryService
      .get({ withAuth: false })
      .then((res) => {
        const cats = Array.isArray(res.data?.data) ? res.data.data : [];
        setTopCategories(cats.slice(0, 3)); // أول 3 أقسام فقط
        setLoading(false);
      })
      .catch((e) => {
        setErr("تعذر تحميل الأقسام.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Billboard />
      <RecentProducts />
      <Categories />
      {loading && (
        <div className="container text-center py-5">جارِ تحميل الأقسام...</div>
      )}
      {err && <div className="alert alert-danger">{err}</div>}
      {!loading &&
        !err &&
        topCategories.map((cat) => (
          <MostDemandedProducts key={cat.id} category={cat} />
        ))}
      <Features />
      <Testimonials />
    </>
  );
}
