import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ استدعاء useNavigate
import loginService from "../../services/Auth/loginService";
import CryptoJS from "crypto-js";
import "./Auth.css";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ENCRYPTION_KEY = "fikriti-secret-key-2025";
  const navigate = useNavigate(); // ✅ تعريف التنقل

  useEffect(() => {
    const timer = setTimeout(() => {
      setServerError("");
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [serverError, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const safeEncrypt = (value) => {
    try {
      if (value === undefined || value === null) return "";
      return CryptoJS.AES.encrypt(String(value), ENCRYPTION_KEY).toString();
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await loginService.login(formData);
      const { token, user, message, role, status } = response?.data || {};

      if (token || status === true) {
        const encryptedRole = safeEncrypt(role ?? user?.role);
        const encryptedUserRole = safeEncrypt(user?.role);

        const userWithEncryptedRole = {
          ...user,
          role: encryptedUserRole,
        };

        localStorage.setItem(
          "user",
          JSON.stringify({
            token,
            user: userWithEncryptedRole,
            role: encryptedRole,
          })
        );

        setSuccessMessage(message || "تم تسجيل الدخول بنجاح");

        if (typeof onLoginSuccess === "function") {
          onLoginSuccess({
            token,
            user: userWithEncryptedRole,
            role: encryptedRole,
          });
        }

        setFormData({ email: "", password: "" });

        // ✅ التوجيه حسب قيمة role
        if (Number(role) === 1) {
          window.location.href = "/Dashboard/orders";
        } else {
          window.location.href = "/";
        }
      } else {
        setServerError(message || "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        const serverErrors = {};
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            serverErrors[field] = Array.isArray(messages)
              ? messages[0]
              : String(messages);
          }
        );
        setErrors(serverErrors);
      } else if (error?.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">تسجيل الدخول</h2>

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

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>البريد الإلكتروني</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              isInvalid={!!errors.email}
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>كلمة المرور</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              isInvalid={!!errors.password}
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100 auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
