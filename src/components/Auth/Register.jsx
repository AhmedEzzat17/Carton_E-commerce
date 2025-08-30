import { useState, useEffect } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import registerService from "../../services/Auth/registerService";

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    password_confirmation: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (serverError || successMessage) {
      const timer = setTimeout(() => {
        setServerError("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverError, successMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await registerService.register(formData);

      if (response.data) {
        const { message, user } = response.data;
        setSuccessMessage(message || "تم إنشاء الحساب بنجاح");

        if (onRegisterSuccess) onRegisterSuccess({ user });

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          password_confirmation: ""
        });
      }
    } catch (error) {
      console.error("Register error:", error);

      if (error.response?.data?.errors) {
        const serverErrors = {};
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          serverErrors[field] = messages[0];
        });
        setErrors(serverErrors);
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="auth-form">
      {serverError && (
        <Alert variant="danger" className="auth-alert text-center">
          {serverError}
        </Alert>
      )}
      {successMessage && (
        <Alert variant="success" className="auth-alert text-center">
          {successMessage}
        </Alert>
      )}

      {/* الاسم */}
      <Form.Group controlId="name">
        <Form.Label>الاسم</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          placeholder="ادخل اسمك الكامل"
          onChange={handleChange}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>

      {/* البريد الإلكتروني */}
      <Form.Group controlId="email">
        <Form.Label>البريد الإلكتروني</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          placeholder="example@email.com"
          onChange={handleChange}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>

      {/* رقم الهاتف (اختياري) */}
      <Form.Group controlId="phone">
        <Form.Label>رقم الهاتف <small className="text-muted">(اختياري)</small></Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="01012345678 (اختياري)"
          onChange={handleChange}
          isInvalid={!!errors.phone}
        />
        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
      </Form.Group>

      {/* العنوان (اختياري) */}
      <Form.Group controlId="address">
        <Form.Label>العنوان <small className="text-muted">(اختياري)</small></Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          placeholder="العنوان بالتفصيل (اختياري)"
          onChange={handleChange}
          isInvalid={!!errors.address}
        />
        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
      </Form.Group>

      {/* كلمة المرور */}
      <Form.Group controlId="password">
        <Form.Label>كلمة المرور</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          placeholder="********"
          onChange={handleChange}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </Form.Group>

      {/* تأكيد كلمة المرور */}
      <Form.Group controlId="password_confirmation">
        <Form.Label>تأكيد كلمة المرور</Form.Label>
        <Form.Control
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          placeholder="********"
          onChange={handleChange}
          isInvalid={!!errors.password_confirmation}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password_confirmation}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className="mt-3 w-100" variant="primary" disabled={isLoading}>
        {isLoading ? "جارٍ التسجيل..." : "تسجيل"}
      </Button>
    </Form>
  );
}

export default Register;
