// src/A-Dashboard/categories/CategoryShow.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryService from "../../services/categoryService";

const CategoryShow = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [message, setMessage] = useState("");

  const BASE_IMAGE_URL = "https://myappapi.fikriti.com/";

  useEffect(() => {
    fetchCategories(page, search);
  }, [page]);

  const fetchCategories = async (currentPage = 1, searchTerm = "") => {
    try {
      const res = await CategoryService.getWithPagination(currentPage, searchTerm);
      setCategories(res.data.data.data || []);
      setLastPage(res.data.data.last_page || 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCategories(1, search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      await CategoryService.delete(id);
      setMessage("تم حذف القسم بنجاح");
      setTimeout(() => setMessage(""), 3000);
      fetchCategories(page, search);
    } catch (err) {
      console.error(err);
    }
  };

  const printTable = () => {
    const printContents = document.getElementById("printArea").innerHTML;
    const w = window.open("", "", "width=900,height=700");
    w.document.write(`
      <html>
      <head>
        <title>طباعة قائمة الأصناف</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <style>
          body { direction: rtl; font-family: Arial, sans-serif; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 10px; text-align: center; }
          th { background-color: #343a40; color: white; }
          tr:nth-child(even) { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <h3>قائمة الأصناف</h3>
        ${printContents}
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <div className="row justify-content-center">
        <h1 className="text-center mb-4 fw-bold text-primary">إدارة الأصناف</h1>
        <div className="col-md-12">
          {message && <div className="alert alert-success text-center">{message}</div>}

          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">قائمة الأصناف</h4>
              <Link to="/Dashboard/categories/create" className="btn btn-light btn-sm text-dark">
                إضافة صنف
              </Link>
            </div>

            <div className="card-body bg-light">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-2">
                <button onClick={printTable} className="btn btn-outline-dark btn-sm shadow-sm">
                  <i className="bi bi-printer"></i> طباعة
                </button>
                <form className="d-flex w-100" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="ابحث عن صنف..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">بحث</button>
                </form>
              </div>

              <div id="printArea" className="table-responsive bg-white p-4 rounded-4 shadow-sm border">
                <table className="table table-hover table-bordered text-center align-middle mb-0">
                  <thead className="table-light text-dark fw-bold">
                    <tr>
                      <th>#</th>
                      <th>الاسم</th>
                      <th>المعرف (Slug)</th>
                      <th>الوصف</th>
                      <th>الصورة</th>
                      <th>تاريخ الإضافة</th>
                      <th colSpan={2}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? (
                      categories.map((cat, index) => (
                        <tr key={cat.id}>
                          <td>{(page - 1) * 10 + index + 1}</td>
                          <td className="fw-semibold">{cat.name}</td>
                          <td className="text-muted">{cat.slug}</td>
                          <td className="text-muted">{cat.note || "-"}</td>
                          <td>
                            {cat.image ? (
                              <img
                                src={`${BASE_IMAGE_URL}${cat.image}`}
                                alt="صورة"
                                className="img-thumbnail"
                                style={{ height: "50px", width: "auto" }}
                              />
                            ) : (
                              <span className="text-muted">بدون صورة</span>
                            )}
                          </td>
                          <td className="text-muted">
                            {new Date(cat.created_at).toLocaleDateString("ar-EG")}
                          </td>
                          <td>
                            <Link
                              to={`/Dashboard/categories/edit/${cat.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              تعديل
                            </Link>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="btn btn-sm btn-danger"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-5">
                          <i className="bi bi-info-circle fs-4 text-primary mb-2"></i>
                          <p className="mb-0">لا توجد أصناف حالياً.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <nav className="mt-2 justify-content-center">
                <ul className="pagination justify-content-center flex-wrap gap-2 text-center">
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShow;
