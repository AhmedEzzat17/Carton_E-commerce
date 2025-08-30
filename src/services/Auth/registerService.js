// src/services/Auth/registerService.js
import ApiFunctions from '../ApiFunctions';

class RegisterService extends ApiFunctions {
  constructor() {
    super('register');
  }

  // دالة تسجيل مستخدم جديد
  register = async (userData) => {
  return this.post(userData, { withAuth: false,
  useCredentials: true, // مهم جدًا});
  });  };
}

export default new RegisterService();