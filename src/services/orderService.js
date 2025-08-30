// src/services/dashboard/OrderService.js
import ApiFunctions from "./ApiFunctions";

class OrderService extends ApiFunctions {
  constructor() {
    super("dashboard/orders"); // نفس المسار المستخدم في Angular
  }
}

export default new OrderService(); // بنصدر instance واحدة مباشرة
