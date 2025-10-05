import React, { useState, useEffect } from "react";
import UserService from "../../services/userService";
import { Link } from "react-router-dom";

export default function UserCreate() {
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
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user?.id) {
      setFormData((prev) => ({
        ...prev,
        user_add_id: user.user.id,
      }));
    }
  }, []);

  useEffect(() => {
    if (serverMessage) {
      const timer = setTimeout(() => {
        setServerMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^\d{10,15}$/.test(formData.phone.trim()))
      newErrors.phone = "رقم الهاتف غير صحيح";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email.trim()))
      newErrors.email = "البريد الإلكتروني غير صحيح";
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (formData.password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    if (!formData.password_confirmation)
      newErrors.password_confirmation = "تأكيد كلمة المرور مطلوب";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "كلمتا المرور غير متطابقتين";
    if (!formData.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!(formData.role === "0" || formData.role === "1"))
      newErrors.role = "الصلاحية مطلوبة (يوزر أو أدمن)";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await UserService.post(formData);
      setServerMessage(response.data.message || "تم إنشاء المستخدم بنجاح");
      setIsSuccess(true);
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        address: "",
        role: "0",
      });
      setErrors({});
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.data?.message) {
        setServerMessage(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setServerMessage("حدث خطأ غير متوقع.");
      }
    }
  };

  return (
    <div className="py-5" dir="rtl">
      {/* رسالة النجاح/الخطأ فوق الشاشة */}
      {serverMessage && (
        <div
          className={`alert ${isSuccess ? "alert-success" : "alert-danger"} text-center`}
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
          {serverMessage}
        </div>
      )}
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header text-white rounded-top-4" style={{ backgroundColor: "var(--primary-color)" }}>
                <h4 className="mb-0">
                  <i className="bi bi-plus-circle me-2" style={{ color: "white" }}></i> إضافة مستخدم جديد
                </h4>
              </div>
              <div className="card-body bg-light">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">الاسم</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        رقم الهاتف <small className="text-muted">(اختياري)</small>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">البريد الإلكتروني</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">كلمة المرور</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">تأكيد كلمة المرور</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.password_confirmation ? "is-invalid" : ""
                        }`}
                      />
                      {errors.password_confirmation && (
                        <div className="invalid-feedback">
                          {errors.password_confirmation}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        العنوان <small className="text-muted">(اختياري)</small>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">نوع المستخدم</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`form-select ${
                          errors.role ? "is-invalid" : ""
                        }`}
                      >
                        <option value="0">مستخدم</option>
                        <option value="1">مدير</option>
                      </select>
                      {errors.role && (
                        <div className="invalid-feedback">{errors.role}</div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <Link to="/Dashboard/users" className="btn btn-secondary">
                      <i className="bi bi-arrow-right me-1" style={{ color: "white" }}></i> رجوع
                    </Link>
                    <button type="submit" className="btn" style={{ backgroundColor: "var(--primary-color)", color: "white" }}>
                      <i className="bi bi-check-circle me-1" style={{ color: "white" }}></i> حفظ المستخدم
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
