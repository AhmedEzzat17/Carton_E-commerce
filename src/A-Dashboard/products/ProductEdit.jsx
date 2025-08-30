import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CategoryService from "../../services/categoryService";

export default function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    note: "",
    image: null,
    category_id: "",
  });

  const [oldImage, setOldImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [editRes, allCategories] = await Promise.all([
        CategoryService.edit(id),
        CategoryService.get(),
      ]);

      const data = editRes.data.data;
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        note: data.note || "",
        category_id: data.category_id || "",
        image: null,
      });

      setOldImage(data.image || null);

      const nestedData = allCategories?.data?.data?.data || [];
      setCategories(Array.isArray(nestedData) ? nestedData : []);
    } catch (err) {
      console.error("فشل تحميل البيانات:", err);
      showMessage("فشل تحميل بيانات القسم", "error");
    }
  };

  const showMessage = (msg, type = "success") => {
    setServerMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setServerMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files.length > 0 ? files[0] : null;
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.slug.trim()) newErrors.slug = "المعرف (slug) مطلوب";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("slug", formData.slug);
    updateData.append("note", formData.note || "");
    if (formData.category_id) {
      updateData.append("category_id", formData.category_id);
    }
    if (formData.image) {
      updateData.append("image", formData.image);
    }
    updateData.append("_method", "PATCH");

    // console.log("FormData being sent:");
    // for (let pair of updateData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    try {
      const response = await CategoryService.patchPOST(id, updateData);
      showMessage(response.data.message || "تم تحديث القسم بنجاح", "success");

      setTimeout(() => {
        navigate("/Dashboard/categories");
      }, 3000);
    } catch (err) {
      // console.error("خطأ أثناء التحديث:", err);
      // console.log("الرد الكامل:", err.response?.data);
       if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showMessage("يرجى تصحيح الأخطاء", "error");
      } else {
        showMessage("حدث خطأ أثناء الحفظ", "error");
      }
    }
  };

  return (
    <div className="py-5" dir="rtl" style={{ backgroundColor: "#f7f9fc" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow border-0 rounded-4">
              <div
                className="card-header rounded-top-4"
                style={{
                  background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
                  color: "#fff",
                }}
              >
                <h4 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i> تعديل بيانات القسم
                </h4>
              </div>

              <div className="card-body bg-light p-4">
                {serverMessage && (
                  <div
                    className={`alert text-center ${
                      messageType === "error" ? "alert-danger" : "alert-success"
                    }`}
                  >
                    {serverMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row gy-3">
                    {/* الاسم */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        الاسم
                        {errors.name && (
                          <span className="text-danger small d-block mt-1">
                            {errors.name}
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                      />
                    </div>

                    {/* slug */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        المعرف (slug)
                        {errors.slug && (
                          <span className="text-danger small d-block mt-1">
                            {errors.slug}
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.slug ? "is-invalid" : ""
                        }`}
                      />
                    </div>

                    {/* note */}
                    <div className="col-md-12">
                      <label className="form-label fw-bold">
                        وصف / ملاحظات <span className="text-danger">- اختياري</span>
                      </label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="form-control"
                        rows={3}
                      ></textarea>
                    </div>

                    {/* التصنيف الأب */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        القسم الرئيسي <span className="text-danger">- اختياري</span>
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id || ""}
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

                    {/* الصورة */}
                    <div className="col-md-6">
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
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="معاينة"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "100px" }}
                        />
                      ) : oldImage ? (
                        <img
                          src={`https://myappapi.fikriti.com/${oldImage}`}
                          alt="الصورة الحالية"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "100px" }}
                        />
                      ) : null}
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between">
                    <Link to="/Dashboard/categories" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-right me-1"></i> رجوع
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-1"></i> حفظ التعديلات
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
