// src/services/interface/productService.js
import ApiFunctions from "../ApiFunctions";

class ProductService extends ApiFunctions {
  constructor() {
    super("interface/products"); // نفس المسار المستخدم في Angular
  }
}

export default new ProductService(); // بنصدر instance واحدة مباشرة
