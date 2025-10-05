// UserShow.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../../services/userService";

const UserShow = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  const fetchUsers = async (currentPage = 1, searchTerm = "") => {
    try {
      const res = await UserService.getWithPagination(currentPage, searchTerm);

      // البيانات موجودة في res.data.data.data
      setUsers(res.data.data.data);

      // والـ last_page موجودة في res.data.data.last_page
      setLastPage(res.data.data.last_page);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await UserService.delete(deleteId);
      setMessage("تم حذف المستخدم بنجاح");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      fetchUsers(page, search);
    } catch (err) {
      setMessage("حدث خطأ أثناء الحذف");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const printTable = () => {
    const printContents = document.getElementById("printArea").innerHTML;
    const w = window.open("", "", "width=900,height=700");
    w.document.write(`
      <html>
      <head>
        <title>طباعة قائمة المستخدمين</title>
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
        <h3>قائمة المستخدمين</h3>
        ${printContents}
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="container mt-4" dir="rtl">
      {/* رسالة النجاح/الخطأ فوق الشاشة */}
      {message && (
        <div
          className={`alert text-center ${messageType === "error" ? "alert-danger" : "alert-success"}`}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            minWidth: "300px",
            maxWidth: "500px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          {message}
        </div>
      )}
      
      <div className="row justify-content-center">
        <h1 className="text-center mb-4 fw-bold" style={{ color: "var(--primary-color)" }}>
          إدارة المستخدمين
        </h1>
        <div className="col-md-12">
          <div className="card shadow-lg border-0">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "var(--primary-color)" }}>
              <h4 className="mb-0">قائمة المستخدمين</h4>
              <Link
                to="/Dashboard/users/create"
                className="btn btn-light btn-sm text-dark"
              >
                إضافة مستخدم
              </Link>
            </div>

            <div className="card-body bg-light">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-2">
                <button
                  onClick={printTable}
                  className="btn btn-sm shadow-sm"
                >
                  <i className="bi bi-printer"></i> طباعة
                </button>
                <form className="d-flex w-100" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="ابحث عن مستخدم..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn" style={{ backgroundColor: "var(--primary-color)", color: "white" }}>
                    بحث
                  </button>
                </form>
              </div>
              <div
                id="printArea"
                className="table-responsive bg-white p-4 rounded-4 shadow-sm border"
              >
                <table className="table table-hover table-bordered text-center align-middle mb-0 rounded-4 overflow-hidden">
                  <thead className="table-light text-dark fw-bold">
                    <tr>
                      <th>#</th>
                      <th>الاسم</th>
                      <th>البريد الإلكتروني</th>
                      <th>رقم الهاتف</th>
                      <th>الدور</th>
                      <th>العنوان</th>
                      <th colSpan={2}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user.id}>
                          <td>{(page - 1) * 10 + index + 1}</td>
                          <td className="fw-semibold">{user.name}</td>
                          <td className="text-muted">{user.email}</td>
                          <td className="text-muted">{user.phone || "-"}</td>
                          <td>
                            <span
                              className={`badge  py-2 rounded-pill fw-medium ${
                                user.role === 1
                                  ? "bg-secondary   border-success-subtle"
                                  : "--primary-color  border-primary-subtle"
                              }`}
                            >
                              {user.role === 1 ? "أدمن" : "مستخدم"}
                            </span>
                          </td>
                          <td className="text-muted">{user.address || "-"}</td>

                          <td>
                            <Link
                              to={`/Dashboard/users/edit/${user.id}`}
                              className="btn btn-sm d-flex align-items-center justify-content-center gap-1"
                              style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                            >
                              تعديل
                            </Link>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteClick(user.id)}
                              className="btn btn-sm btn-danger d-flex align-items-center justify-content-center gap-1"
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
                          <p className="mb-0">لا يوجد مستخدمين متاحين.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <nav className="mt-2 justify-content-center">
                <ul className="pagination justify-content-center flex-wrap gap-2 text-center">
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                    (p) => (
                      <li
                        key={p}
                        className={`page-item ${p === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" dir="rtl">
              <div className="modal-header" style={{ backgroundColor: "#dc3545", color: "white" }}>
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  تأكيد الحذف
                </h5>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-3">
                  <i className="bi bi-trash3 text-danger" style={{ fontSize: "3rem" }}></i>
                </div>
                <h6 className="mb-3">هل أنت متأكد من حذف هذا المستخدم؟</h6>
                <p className="text-muted">لا يمكن التراجع عن هذا الإجراء</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={cancelDelete}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  <i className="bi bi-trash3 me-1"></i>
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserShow;
