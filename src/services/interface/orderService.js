// src/services/interface/OrderService.js
import ApiFunctions from "../ApiFunctions";
import axios from "axios";

class OrderService extends ApiFunctions {
  constructor() {
    super("user-orders"); // استخدام endpoint الجديد
  }

  // دالة لجلب طلبات المستخدم الحقيقية فقط
  getUserOrders = async ({ withAuth = true } = {}) => {
    const headers = this.getHeaders({ withAuth });
    return axios.get(
      "https://myappapi.fikriti.com/api/v1/user-orders",
      headers
    );
  };

  // دالة بديلة مباشرة مع axios
  getUserOrdersDirect = async ({ withAuth = true } = {}) => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
    return axios.get("https://myappapi.fikriti.com/api/v1/user-orders", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  };

  // دالة إنشاء طلب جديد - نظام fallback شامل
  createOrder = async (orderData) => {
    console.log('📤 إرسال طلب جديد إلى API:', orderData);
    
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
    const isFormData = orderData instanceof FormData;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    
    // إذا كانت FormData لا نضع Content-Type (axios يضعه تلقائياً)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // قائمة endpoints للتجربة بالترتيب
    const endpoints = [
      "https://myappapi.fikriti.com/api/v1/orders",
      "https://myappapi.fikriti.com/api/v1/dashboard/orders", 
      "https://myappapi.fikriti.com/api/v1/interface/orders",
      "https://myappapi.fikriti.com/api/v1/create-order",
      "https://myappapi.fikriti.com/api/v1/order"
    ];

    let lastError = null;

    // جرب كل endpoint حتى يجد واحد يعمل
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`🔄 جرب endpoint ${i + 1}/${endpoints.length}: ${endpoint}`);
      
      try {
        const response = await axios.post(endpoint, orderData, { headers });
        
        console.log(`✅ نجح endpoint ${i + 1}: ${endpoint}`);
        console.log('✅ تم إنشاء الطلب بنجاح:', response.data);
        
        // إرسال إشارة للداشبورد أن طلب جديد تم إضافته
        window.dispatchEvent(new CustomEvent('newOrderAdded', { 
          detail: response.data 
        }));
        
        return response;
        
      } catch (error) {
        lastError = error;
        console.warn(`❌ فشل endpoint ${i + 1}: ${endpoint}`, error.response?.status, error.response?.data?.message || error.message);
        
        // إذا كان آخر endpoint، ارمي الخطأ
        if (i === endpoints.length - 1) {
          console.error('❌ فشلت جميع endpoints المتاحة');
          break;
        }
      }
    }

    // إذا فشلت جميع المحاولات، اعرض رسالة مفيدة
    console.error('❌ لم يتم العثور على endpoint صحيح لإنشاء الطلبات');
    console.error('💡 يرجى التأكد من أن الباك إند يدعم أحد هذه المسارات:', endpoints);
    
    throw new Error(`فشل في إنشاء الطلب - جميع endpoints غير متاحة. آخر خطأ: ${lastError?.response?.data?.message || lastError?.message}`);
  };
}

export default new OrderService(); // بنصدر instance واحدة مباشرة
