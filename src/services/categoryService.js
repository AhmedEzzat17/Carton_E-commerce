// src/services/categoryService.js
import ApiFunctions from './ApiFunctions';

class Categorieservice extends ApiFunctions {
  constructor() {
    super('dashboard/categories'); // نفس المسار المستخدم في Angular
  }

  // ممكن تضيف دوال مخصصة هنا
}

export default new Categorieservice(); // بنصدر instance واحدة مباشرة
