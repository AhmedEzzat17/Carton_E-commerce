// src/services/interface/OrderService.js
import ApiFunctions from "../ApiFunctions";

class OrderService extends ApiFunctions {
  constructor() {
    super("interface/orders"); // نفس المسار المستخدم في Angular
  }
}

export default new OrderService(); // بنصدر instance واحدة مباشرة
