// src/A-Dashboard/categories/CategoryCreate.js
import React, { useState, useEffect } from "react";
import CategoryService from "../../services/categoryService";
import { Link } from "react-router-dom";

export default function CategoryCreate() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    note: "",
    category_id: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (serverMessage) {
      const timer = setTimeout(() => setServerMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.get();
      const nestedData = response?.data?.data?.data;
      setCategories(Array.isArray(nestedData) ? nestedData : []);
    } catch (error) {
      setCategories([]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.slug.trim()) newErrors.slug = "المعرف (slug) مطلوب";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files && files.length > 0 ? files[0] : null;
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("slug", formData.slug.trim());
    if (formData.note.trim()) submitData.append("note", formData.note.trim());
    if (formData.category_id) submitData.append("category_id", formData.category_id);
    if (formData.image) submitData.append("image", formData.image);

    try {
      const response = await CategoryService.post(submitData, {
        withAuth: true,
        useCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }, // مهم جدًا
      });

      setServerMessage(response.data.message || "تم إنشاء القسم بنجاح");
      setIsSuccess(true);
      setFormData({
        name: "",
        slug: "",
        note: "",
        category_id: "",
        image: null,
      });
      setErrors({});
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        setServerMessage("تحقق من البيانات المدخلة");
      } else if (error.response?.data?.message) {
        setServerMessage(error.response.data.message);
      } else {
        setServerMessage("حدث خطأ غير متوقع.");
      }
    }
  };

  return (
    <div className="py-5" dir="rtl">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h4 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i> إضافة قسم جديد
                </h4>
              </div>
              <div className="card-body bg-light">
                {serverMessage && (
                  <div className={`alert ${isSuccess ? "alert-success" : "alert-danger"} text-center`}>
                    {serverMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">اسم القسم</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Slug المعرف</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                      />
                      {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label fw-bold">
                        ملاحظات / وصف <span className="text-danger">- اختياري</span>
                      </label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows="3"
                        className="form-control"
                      ></textarea>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        القسم الرئيسي <span className="text-danger">- اختياري</span>
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">-- اختر قسم --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        الصورة <span className="text-danger">- اختياري</span>
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="form-control"
                      />
                      {formData.image && (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="معاينة"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "100px" }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <Link to="/Dashboard/categories" className="btn btn-secondary">
                      <i className="bi bi-arrow-right me-1"></i> رجوع
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-1"></i> حفظ القسم
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
