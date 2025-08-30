// src/services/Auth/loginService.js
import ApiFunctions from '../ApiFunctions';

 class  LoginService extends ApiFunctions {
  constructor() {
    super('login');
  }

  login = async (userData) => {

    // إرسال البيانات بدون توكن
    return this.post(userData, { withAuth: false,
  useCredentials: true, // مهم جدًا});
  });
}
}

export default new LoginService();