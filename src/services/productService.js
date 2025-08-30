// src/services/productService.js
import ApiFunctions from "./ApiFunctions";

class ProductService extends ApiFunctions {
  constructor() {
    super("dashboard/products"); // نفس المسار المستخدم في Angular
  }

}

export default new ProductService(); // بنصدر instance واحدة مباشرة
