// src/services/userService.js
import ApiFunctions from './ApiFunctions';

class UserService extends ApiFunctions {
  constructor() {
    super('dashboard/users'); // نفس المسار المستخدم في Angular
  }

  // ممكن تضيف دوال مخصصة هنا
}

export default new UserService(); // بنصدر instance واحدة مباشرة