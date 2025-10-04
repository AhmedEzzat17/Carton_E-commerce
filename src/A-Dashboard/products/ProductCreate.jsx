// src/A-Dashboard/products/ProductCreate.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CategoryService from "../../services/categoryService";
import ProductService from "../../services/productService";
import "./ProductCreate.css";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUpload,
  faSearch,
  faSave,
  faBoxOpen,
  faChevronUp,
  faChevronDown,
  faInfoCircle,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function ProductCreate() {
  // حالة النموذج الأساسية
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    slug: "",
    description: "",
    category_id: "",
    price: "",
    compare_price: "",
    cost_price: "",
    features: "",
    details: "",
    weight: "",
    main_image: null,
    images: [],
    user_add_id: 1,
  });

  // حالات إضافية للواجهة
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showPricingSection, setShowPricingSection] = useState(false);
  const [showImageSection, setShowImageSection] = useState(false);
  const [showVariantSection, setShowVariantSection] = useState(false);
  const [variantEnabled, setVariantEnabled] = useState(false);
  const [variants, setVariants] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  // تحميل التصنيفات عند تحميل الصفحة
  useEffect(() => {
    fetchCategories();

    // إضافة مستمع للنقر على المستند لإخفاء القائمة المنسدلة
    const handleClickOutside = (event) => {
      if (
        event.target.id !== "categorySearch" &&
        !event.target.closest(".category-dropdown")
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // إزالة المستمع عند تفكيك المكون
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // إخفاء رسالة السيرفر بعد 3 ثوان
  useEffect(() => {
    if (serverMessage) {
      const timer = setTimeout(() => setServerMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage]);

  // توليد SKU تلقائياً
  const generateSKU = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SKU${timestamp}${random}`.toUpperCase();
  };

  // توليد Slug تلقائياً
  const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  // جلب التصنيفات من السيرفر
  const fetchCategories = async () => {
    try {
      const response = await CategoryService.get();
      const nestedData = response?.data?.data?.data;
      setCategories(Array.isArray(nestedData) ? nestedData : []);
    } catch (error) {
      console.error("فشل تحميل التصنيفات:", error);
      setCategories([]);
    }
  };

  // التحقق من صحة البيانات
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "اسم المنتج مطلوب";
    if (!formData.description.trim())
      newErrors.description = "وصف المنتج مطلوب";
    if (!formData.category_id)
      newErrors.category_id = "يرجى اختيار تصنيف المنتج";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "السعر الأساسي مطلوب ويجب أن يكون أكبر من 0";

    if (
      formData.compare_price &&
      parseFloat(formData.compare_price) <= parseFloat(formData.price)
    ) {
      newErrors.compare_price =
        "يجب أن يكون سعر المقارنة أكبر من السعر الأساسي";
    }

    if (
      formData.cost_price &&
      parseFloat(formData.cost_price) >= parseFloat(formData.price)
    ) {
      newErrors.cost_price = "يجب أن تكون تكلفة المنتج أقل من السعر الأساسي";
    }

    return newErrors;
  };

  // معالجة تغيير الحقول
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "images") {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileArray],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // توليد Slug تلقائياً عند تغيير اسم المنتج
      if (name === "name") {
        const slug = generateSlug(value);
        setFormData((prev) => ({ ...prev, slug }));
      }
    }

    // مسح الخطأ عند تغيير القيمة
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // معالجة البحث عن التصنيفات
  const handleCategorySearch = (e) => {
    setCategorySearchTerm(e.target.value);
    setShowCategoryDropdown(true);
  };

  // اختيار تصنيف
  const selectCategory = (category) => {
    setFormData((prev) => ({ ...prev, category_id: category.id }));
    setCategorySearchTerm(category.name);
    setShowCategoryDropdown(false);
  };

  // فتح مودال اختيار الصور
  const openImageModal = () => {
    setShowImageModal(true);
  };

  // إغلاق مودال اختيار الصور
  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // فتح مربع حوار اختيار الملفات
  const handleUploadImages = () => {
    fileInputRef.current.click();
  };

  // معالجة اختيار الصور
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
      setShowImageSection(true);
    }
  };

  // معالجة اختيار الصورة الأساسية
  const handleMainImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        main_image: file,
      }));
    }
  };

  // فتح مربع حوار اختيار الصورة الأساسية
  const handleUploadMainImage = () => {
    mainImageInputRef.current.click();
  };

  // حذف الصورة الأساسية
  const removeMainImage = () => {
    setFormData((prev) => ({
      ...prev,
      main_image: null,
    }));
  };

  // حذف صورة
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // تبديل عرض الأقسام
  const toggleSection = (section) => {
    if (section === "pricing") {
      setShowPricingSection(!showPricingSection);
    } else if (section === "image") {
      setShowImageSection(!showImageSection);
    } else if (section === "variant") {
      setShowVariantSection(!showVariantSection);
    }
  };

  // تبديل حالة المتغيرات
  const toggleVariant = () => {
    setVariantEnabled(!variantEnabled);
  };

  // إضافة متغير جديد
  const addVariant = () => {
    setVariants([...variants, { name: "", type: 0, values: [] }]);
  };

  // تحديث اسم المتغير
  const updateVariantName = (index, name) => {
    const newVariants = [...variants];
    newVariants[index].name = name;
    setVariants(newVariants);
  };

  // تحديث نوع المتغير
  const updateVariantType = (index, type) => {
    const newVariants = [...variants];
    const variant = newVariants[index];
    variant.type = parseInt(type);

    // تحديث color_name للقيم الموجودة
    if (parseInt(type) === 0) {
      // إذا كان نوع اللون، أضف color_name للقيم الموجودة
      variant.values.forEach((value) => {
        if (!value.color_name) {
          value.color_name = "#000000"; // لون افتراضي
        }
      });
    } else {
      // إذا كان النوع 1 (غير لون)، احذف color_name
      variant.values.forEach((value) => {
        delete value.color_name;
      });
    }

    setVariants(newVariants);
  };

  // إضافة قيمة للمتغير
  const addVariantValue = (variantIndex, value) => {
    if (!value.trim()) return;

    const newVariants = [...variants];
    const variant = newVariants[variantIndex];

    // التحقق من عدم تكرار القيمة
    if (!variant.values.some((v) => v.value === value.trim())) {
      const newValue = {
        value: value.trim(),
      };

      // إضافة color_name إذا كان نوع اللون (type = 0)
      if (variant.type === 0) {
        newValue.color_name = "#000000"; // لون افتراضي
      }

      variant.values.push(newValue);
      setVariants(newVariants);
    }
  };

  // حذف قيمة من المتغير
  const removeVariantValue = (variantIndex, valueIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].values.splice(valueIndex, 1);
    setVariants(newVariants);
  };

  // حذف متغير
  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // تحديث اللون الأساسي
  const updateVariantColor = (variantIndex, valueIndex, colorHex) => {
    const newVariants = [...variants];
    const variant = newVariants[variantIndex];

    if (variant.type === 0 && variant.values[valueIndex]) {
      variant.values[valueIndex].color_name = colorHex;
      setVariants(newVariants);
    }
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // عرض مؤشر التحميل
    setServerMessage("جاري إنشاء المنتج...");
    setIsSuccess(true);

    // تعطيل زر الإرسال أثناء المعالجة
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري الإنشاء...';
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("sku", formData.sku || generateSKU());
    submitData.append("slug", formData.slug || generateSlug(formData.name));
    submitData.append("description", formData.description);
    submitData.append("category_id", formData.category_id);
    submitData.append("price", formData.price);
    submitData.append("user_add_id", formData.user_add_id);

    if (formData.compare_price)
      submitData.append("compare_price", formData.compare_price);
    if (formData.cost_price)
      submitData.append("cost_price", formData.cost_price);
    if (formData.features)
      submitData.append("features", formData.features);
    if (formData.details)
      submitData.append("details", formData.details);
    if (formData.weight)
      submitData.append("weight", formData.weight);

    // إضافة الصورة الأساسية
    if (formData.main_image) {
      submitData.append("images", formData.main_image);
    }

    // إضافة الصور الإضافية
    formData.images.forEach((image, index) => {
      submitData.append(`product_images[${index}][url]`, image);
      submitData.append(`product_images[${index}][alt_text]`, `صورة ${index + 1}`);
      submitData.append(`product_images[${index}][sort_order]`, index);
    });

    // إضافة المتغيرات إذا كانت مفعلة
    if (variantEnabled && variants.length > 0) {
      variants.forEach((variant, variantIndex) => {
        submitData.append(`variants[${variantIndex}][name]`, variant.name);
        submitData.append(`variants[${variantIndex}][type]`, variant.type);
        
        variant.values.forEach((value, valueIndex) => {
          submitData.append(`variants[${variantIndex}][values][${valueIndex}][value]`, value.value);
          if (value.color_name) {
            submitData.append(`variants[${variantIndex}][values][${valueIndex}][color_name]`, value.color_name);
          }
          if (value.image_name) {
            submitData.append(`variants[${variantIndex}][values][${valueIndex}][image_name]`, value.image_name);
          }
        });
      });
    }

    try {
      const response = await ProductService.post(submitData, {
        withAuth: true,
        useCredentials: false,
      });

      setServerMessage(response.data.message || "تم إنشاء المنتج بنجاح");
      setIsSuccess(true);

      // إعادة تعيين النموذج
      setFormData({
        name: "",
        sku: "",
        slug: "",
        description: "",
        category_id: "",
        price: "",
        compare_price: "",
        cost_price: "",
        features: "",
        details: "",
        weight: "",
        main_image: null,
        images: [],
        user_add_id: 1,
      });
      setVariants([]);
      setVariantEnabled(false);
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
    } finally {
      // إعادة تفعيل زر الإرسال
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML =
          '<svg class="svg-inline--fa fa-save fa-w-14 me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="save" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64 35.346 0 64 28.654 64 64 0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg> حفظ المنتج';
      }
    }
  };
  // تصفية التصنيفات بناءً على البحث
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid" dir="rtl">
      {/* مودال اختيار الصور */}
      <Modal
        show={showImageModal}
        onHide={closeImageModal}
        size="lg"
        centered
        className="image-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>اختر الصور</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-grid">
            {/* هنا يمكن إضافة صور من المكتبة أو الصور المرفوعة سابقًا */}
            <div className="alert alert-info w-100">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              يمكنك رفع صور جديدة أو اختيار صور من المكتبة.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            إغلاق
          </Button>
          <Button variant="primary" onClick={handleUploadImages}>
            <FontAwesomeIcon icon={faUpload} className="me-2" /> رفع صور جديدة
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card border-0 shadow-lg">
            <div className="card-header text-white py-3" style={{ backgroundColor: "var(--primary-color)" }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 fw-bold border-bottom pb-2 text-white">
                  إضافة منتج جديد
                </h3>
                <Link
                  to="/Dashboard/products"
                  className="btn btn-outline-light btn-lg rounded-pill"
                >
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="me-2 cart-icon"
                  />{" "}
                  عرض المنتجات
                </Link>
              </div>
            </div>
            <div className="card-body p-4 bg-light">
              {serverMessage && (
                <div
                  className={`alert ${
                    isSuccess ? "alert-success" : "alert-danger"
                  } text-center`}
                >
                  {serverMessage}
                </div>
              )}

              <form
                id="productForm"
                onSubmit={handleSubmit}
                className="needs-validation"
              >
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="card border-0 shadow-sm p-3 bg-white">
                      <h5 className="border-bottom pb-2" style={{ color: "var(--primary-color)" }}>
                        معلومات المنتج
                      </h5>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label text-dark">
                          اسم المنتج
                        </label>
                        <input
                          type="text"
                          className={`form-control rounded-pill ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              htmlFor="sku"
                              className="form-label text-dark"
                            >
                              رمز المنتج (SKU)
                            </label>
                            <input
                              type="text"
                              className={`form-control rounded-pill ${
                                errors.sku ? "is-invalid" : ""
                              }`}
                              id="sku"
                              name="sku"
                              value={formData.sku}
                              onChange={handleChange}
                              placeholder="سيتم توليده تلقائياً"
                            />
                            {errors.sku && (
                              <div className="invalid-feedback">
                                {errors.sku}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label
                              htmlFor="slug"
                              className="form-label text-dark"
                            >
                              الرابط المختصر (Slug)
                            </label>
                            <input
                              type="text"
                              className={`form-control rounded-pill ${
                                errors.slug ? "is-invalid" : ""
                              }`}
                              id="slug"
                              name="slug"
                              value={formData.slug}
                              onChange={handleChange}
                              placeholder="سيتم توليده تلقائياً"
                            />
                            {errors.slug && (
                              <div className="invalid-feedback">
                                {errors.slug}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="description"
                          className="form-label text-dark"
                        >
                          الوصف
                        </label>
                        <textarea
                          className={`form-control rounded-3 ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                        ></textarea>
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 mt-3 bg-white">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                        <h5 className="" style={{ color: "var(--primary-color)" }}>الصورة الأساسية</h5>
                      </div>
                      <div className="mt-3 text-center">
                        {formData.main_image ? (
                          <div className="position-relative d-inline-block">
                            <img
                              src={URL.createObjectURL(formData.main_image)}
                              alt="الصورة الأساسية"
                              className="img-fluid rounded"
                              style={{
                                maxWidth: "120px",
                                maxHeight: "120px",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute rounded-circle shadow-sm"
                              style={{
                                top: "-8px",
                                right: "-8px",
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                border: "2px solid white",
                              }}
                              onClick={removeMainImage}
                              title="حذف الصورة"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="border border-dashed border-secondary rounded p-3"
                            style={{
                              cursor: "pointer",
                              minHeight: "100px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={handleUploadMainImage}
                          >
                            <div className="text-center text-muted">
                              <FontAwesomeIcon
                                icon={faUpload}
                                size="lg"
                                className="mb-2 d-block"
                              />
                              <p className="mb-0">
                                انقر لاختيار الصورة الأساسية
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={mainImageInputRef}
                          className="d-none"
                          accept="image/*"
                          onChange={handleMainImageSelect}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card border-0 shadow-sm p-3 mt-3 bg-white">
                          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                            <h5 className="" style={{color: "var(--primary-color)"}}>المميزات الرئيسية</h5>
                          </div>
                          <div className="mt-3">
                            <textarea
                              className="form-control rounded-3"
                              id="features"
                              name="features"
                              rows="3"
                              value={formData.features || ""}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 shadow-sm p-3 mt-3 bg-white">
                          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                            <h5 className="" style={{color: "var(--primary-color)"}}>تفاصيل إضافية</h5>
                          </div>
                          <div className="mt-3">
                            <textarea
                              className="form-control rounded-3"
                              id="details"
                              name="details"
                              rows="3"
                              value={formData.details || ""}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm p-3 mt-3 bg-white">
                      <div className="section-header">
                        <h5 className="" style={{color: "var(--primary-color)"}}>التسعير</h5>
                        <button
                          type="button"
                          className="btn btn-light btn-sm toggle-section"
                          onClick={() => toggleSection("pricing")}
                        >
                          <FontAwesomeIcon
                            icon={
                              showPricingSection ? faChevronUp : faChevronDown
                            }
                          />
                        </button>
                      </div>
                      <div
                        className={`section-content ${
                          showPricingSection ? "" : "d-none"
                        }`}
                      >
                        <div className="pricing-row">
                          <div className="col-md-4">
                            <label
                              htmlFor="price"
                              className="form-label text-dark"
                            >
                              السعر الأساسي
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              className={`form-control rounded-pill ${
                                errors.price ? "is-invalid" : ""
                              }`}
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              required
                            />
                            {errors.price && (
                              <div className="invalid-feedback">
                                {errors.price}
                              </div>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="compare_price"
                              className="form-label text-dark"
                            >
                              سعر المقارنة
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              className={`form-control rounded-pill ${
                                errors.compare_price ? "is-invalid" : ""
                              }`}
                              id="compare_price"
                              name="compare_price"
                              value={formData.compare_price}
                              onChange={handleChange}
                            />
                            {errors.compare_price && (
                              <div className="invalid-feedback">
                                {errors.compare_price}
                              </div>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label
                              htmlFor="cost_price"
                              className="form-label text-dark"
                            >
                              سعر التكلفة
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              className={`form-control rounded-pill ${
                                errors.cost_price ? "is-invalid" : ""
                              }`}
                              id="cost_price"
                              name="cost_price"
                              value={formData.cost_price}
                              onChange={handleChange}
                            />
                            {errors.cost_price && (
                              <div className="invalid-feedback">
                                {errors.cost_price}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm p-3 mt-3 bg-white">
                      <div className="section-header">
                        <h5 className="" style={{color: "var(--primary-color)"}}>الصور</h5>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-success btn"
                            onClick={handleUploadImages}
                          >
                            <FontAwesomeIcon icon={faUpload} className="me-2" />{" "}
                            رفع الصور
                          </button>
                          <button
                            type="button"
                            className="btn btn-light btn-sm toggle-section"
                            onClick={() => toggleSection("image")}
                          >
                            <FontAwesomeIcon
                              icon={
                                showImageSection ? faChevronUp : faChevronDown
                              }
                            />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`section-content ${
                          showImageSection ? "" : "d-none"
                        }`}
                      >
                        <div className="alert alert-info mt-2" role="alert">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="me-2"
                          />{" "}
                          لحصول على أفضل جودة، استخدم صور بحجم 800x800 بكسل.
                        </div>
                        <div className="col-12">
                          <div className="d-flex flex-wrap">
                            {formData.images.map((image, index) => (
                              <div key={index} className="image-container">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`صورة ${index + 1}`}
                                />
                                <div
                                  className="delete-icon"
                                  onClick={() => removeImage(index)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        className="d-none"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </div>

                    <div className="card border-0 shadow-sm p-3 mt-4 bg-white">
                      <div className="section-header">
                        <h5 className="" style={{color: "var(--primary-color)"}}>🛠 المتغيرات</h5>
                        <div className="d-flex gap-2">
                          <label className="switch">
                            <input
                              type="checkbox"
                              id="variantToggle"
                              checked={variantEnabled}
                              onChange={toggleVariant}
                            />
                            <span className="slider"></span>
                          </label>
                          <button
                            type="button"
                            className="btn btn-light btn-sm toggle-section"
                            onClick={() => toggleSection("variant")}
                          >
                            <FontAwesomeIcon
                              icon={
                                showVariantSection ? faChevronUp : faChevronDown
                              }
                            />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`section-content ${
                          showVariantSection ? "" : "d-none"
                        }`}
                      >
                        {!variantEnabled ? (
                          <div className="alert alert-warning text-center mt-2">
                            <p> المتغيرات غير مفعّلة، قم بتشغيلها أولًا.</p>
                          </div>
                        ) : (
                          <div id="variantInputs">
                            {variants.map((variant, variantIndex) => (
                              <div
                                key={variantIndex}
                                className="variant-item mb-3 p-3 border rounded"
                              >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <div className="d-flex align-items-center gap-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="اسم المتغير (مثل: اللون، الحجم)"
                                      value={variant.name}
                                      onChange={(e) =>
                                        updateVariantName(
                                          variantIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <select
                                      className="form-select"
                                      value={variant.type}
                                      onChange={(e) =>
                                        updateVariantType(
                                          variantIndex,
                                          e.target.value
                                        )
                                      }
                                      style={{ width: "auto" }}
                                    >
                                      <option value={0}>لون</option>
                                      <option value={1}>مقاس</option>
                                    </select>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={
                                        variant.type === 0
                                          ? "أدخل اسم اللون واضغط Enter"
                                          : "أدخل القيمة واضغط Enter"
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          addVariantValue(
                                            variantIndex,
                                            e.target.value
                                          );
                                          e.target.value = "";
                                        }
                                      }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm rounded-circle"
                                    onClick={() => removeVariant(variantIndex)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>

                                <div className="variantValuesList">
                                  {variant.values.map(
                                    (valueObj, valueIndex) => (
                                      <div
                                        key={valueIndex}
                                        className="variant-value-card"
                                      >
                                        <div className="value-content">
                                          <span className="value-name">
                                            {valueObj.value}
                                          </span>
                                          {variant.type === 0 && (
                                            <input
                                              type="color"
                                              className="color-picker"
                                              value={
                                                valueObj.color_name || "#000000"
                                              }
                                              onChange={(e) =>
                                                updateVariantColor(
                                                  variantIndex,
                                                  valueIndex,
                                                  e.target.value
                                                )
                                              }
                                              title="اختر اللون الأساسي"
                                            />
                                          )}
                                          <button
                                            type="button"
                                            className="remove-value-btn"
                                            onClick={() =>
                                              removeVariantValue(
                                                variantIndex,
                                                valueIndex
                                              )
                                            }
                                            title="حذف القيمة"
                                          >
                                            <FontAwesomeIcon icon={faTimes} />
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          className="btn btn-outline-primary mt-3 w-100 rounded-pill"
                          id="addVariant"
                          disabled={!variantEnabled}
                          onClick={addVariant}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-2" />{" "}
                          إضافة خيار
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 mt-3 bg-white">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                        <h5 className="" style={{ color :"var(--primary-color)" }} >الوزن (كجم)</h5>
                      </div>
                      <div className="mt-3">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control rounded-pill"
                          id="weight"
                          name="weight"
                          value={formData.weight || ""}
                          onChange={handleChange}
                          placeholder="أدخل وزن المنتج"
                        />
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm p-3  mt-3 bg-white">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                        <h5 className="" style={{ color :"var(--primary-color)" }}>التصنيف</h5>
                      </div>
                      <div className="search-container">
                        <input
                          type="text"
                          id="categorySearch"
                          className="form-control"
                          placeholder="البحث عن التصنيفات"
                          value={categorySearchTerm}
                          onChange={handleCategorySearch}
                          onFocus={() => setShowCategoryDropdown(true)}
                          autoComplete="off"
                        />
                      </div>

                      {showCategoryDropdown && (
                        <div
                          id="category-list"
                          className="category-dropdown"
                          style={{ display: "block" }}
                        >
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <div
                                key={cat.id}
                                onClick={() => selectCategory(cat)}
                              >
                                {cat.name}
                              </div>
                            ))
                          ) : (
                            <div>لا توجد تصنيفات مطابقة</div>
                          )}
                        </div>
                      )}

                      <input
                        type="hidden"
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        required
                      />
                      {errors.category_id && (
                        <div className="invalid-feedback d-block">
                          {errors.category_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg rounded-pill fw-bold shadow"
                    style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-2" /> حفظ
                    المنتج
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}