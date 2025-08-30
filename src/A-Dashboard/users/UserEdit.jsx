// src/pages/users/UserEdit.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserService from "../../services/userService";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    role: "0",
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.edit(id);
        const data = response.data.data;

        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          password: "",
          password_confirmation: "",
          address: data.address || "",
          role: String(data.role) || "0",
        });
      } catch (error) {
        showMessage("تعذر تحميل بيانات المستخدم.", "error");
      }
    };

    fetchUser();
  }, [id]);

  const showMessage = (msg, type = "success") => {
    setServerMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setServerMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await UserService.patch(id, formData); // يفترض أنك عندك userService.update()
      showMessage("تم تحديث المستخدم بنجاح", "success");
         setTimeout(() => {
      navigate("/Dashboard/users");
    }, 3000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        showMessage("يرجى تصحيح الأخطاء أدناه", "error");
      } else {
        showMessage("حدث خطأ أثناء التحديث", "error");
      }
    }
  };

  return (
    <div className="py-5" dir="rtl" style={{ backgroundColor: "#f7f9fc" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card border-0 shadow-sm rounded-4" style={{ backgroundColor: "#ffffff" }}>
              <div
                className="card-header rounded-top-4"
                style={{
                  background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
                  color: "#fff",
                }}
              >
                <h4 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i> تعديل بيانات المستخدم
                </h4>
              </div>

              <div className="card-body p-4">
                {serverMessage && (
                  <div
                    className={`alert text-center ${
                      messageType === "error" ? "alert-danger" : "alert-success"
                    }`}
                  >
                    {serverMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    {/* الاسم */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        الاسم
                        {errors.name && (
                          <span className="text-danger small d-block mt-1">{errors.name}</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      />
                    </div>

                    {/* رقم الهاتف */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        رقم الهاتف
                        {errors.phone && (
                          <span className="text-danger small d-block mt-1">{errors.phone}</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        البريد الإلكتروني
                        {errors.email && (
                          <span className="text-danger small d-block mt-1">{errors.email}</span>
                        )}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      />
                    </div>

                    {/* كلمة المرور */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        كلمة المرور
                        <span className="text-danger small mx-2">
                          (اتركها فارغة إن لم ترغب بالتغيير)
                        </span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {/* تأكيد كلمة المرور */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        تأكيد كلمة المرور
                        <span className="text-danger small mx-2">
                          (اتركها فارغة إن لم ترغب بالتغيير)
                        </span>
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {/* العنوان */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        العنوان
                        {errors.address && (
                          <span className="text-danger small d-block mt-1">{errors.address}</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      />
                    </div>

                    {/* نوع المستخدم */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        نوع المستخدم
                        {errors.role && (
                          <span className="text-danger small d-block mt-1">{errors.role}</span>
                        )}
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`form-select ${errors.role ? "is-invalid" : ""}`}
                      >
                        <option value="0">مستخدم</option>
                        <option value="1">مدير</option>
                      </select>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between">
                    <Link to="/Dashboard/users" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-right me-1"></i> رجوع
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-1"></i> تحديث المستخدم
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
