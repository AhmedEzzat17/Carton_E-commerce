// src/services/interface/OrderService.js
import ApiFunctions from "../ApiFunctions";
import axios from "axios";

class OrderService extends ApiFunctions {
  constructor() {
    super("user-orders"); // استخدام endpoint الجديد
  }

  // دالة لجلب طلبات المستخدم من جميع المصادر
  getUserOrders = async ({ withAuth = true } = {}) => {
    const headers = this.getHeaders({ withAuth });
    
    // قائمة endpoints لجلب الطلبات
    const getEndpoints = [
      "https://myappapi.fikriti.com/api/v1/orders",
      "https://myappapi.fikriti.com/api/v1/user-orders",
      "https://myappapi.fikriti.com/api/v1/dashboard/orders"
    ];
    
    for (let i = 0; i < getEndpoints.length; i++) {
      const endpoint = getEndpoints[i];
      console.log(`🔄 جرب جلب الطلبات من: ${endpoint}`);
      
      try {
        const response = await axios.get(endpoint, headers);
        console.log(`✅ نجح جلب الطلبات من: ${endpoint}`);
        return response;
      } catch (error) {
        console.warn(`❌ فشل جلب الطلبات من: ${endpoint}`, error.response?.status);
        
        if (i === getEndpoints.length - 1) {
          throw error; // إذا فشلت جميع المحاولات
        }
      }
    }
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

  // دالة إنشاء طلب جديد - نظام ذكي للمستخدمين والأدمن
  createOrder = async (orderData) => {
    console.log('📤 إرسال طلب جديد إلى API:', orderData);
    
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user : {};
    const isFormData = orderData instanceof FormData;
    
    console.log('👤 بيانات المستخدم الحالي:', userData);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    
    // إذا كانت FormData لا نضع Content-Type (axios يضعه تلقائياً)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // قائمة endpoints بترتيب محسن - بدء بالذي يعمل
    const endpoints = [
      "https://myappapi.fikriti.com/api/v1/interface/orders", // هذا يعمل حالياً
      "https://myappapi.fikriti.com/api/v1/orders",
      "https://myappapi.fikriti.com/api/v1/dashboard/orders",
      "https://myappapi.fikriti.com/api/v1/create-order",
      "https://myappapi.fikriti.com/api/v1/order"
    ];

    // إضافة معلومات المستخدم للطلب إذا لم تكن موجودة
    let finalOrderData = orderData;
    
    if (!isFormData) {
      // إذا كانت البيانات JSON، أضف معلومات المستخدم
      finalOrderData = {
        ...orderData,
        user_id: userData.id || orderData.user_id,
        user_name: userData.name || orderData.user_name,
        user_email: userData.email || orderData.user_email,
        user_phone: userData.phone || orderData.user_phone
      };
    } else {
      // إذا كانت FormData، أضف معلومات المستخدم
      if (userData.id && !orderData.has('user_id')) {
        orderData.append('user_id', userData.id);
      }
      if (userData.name && !orderData.has('user_name')) {
        orderData.append('user_name', userData.name);
      }
      if (userData.email && !orderData.has('user_email')) {
        orderData.append('user_email', userData.email);
      }
      if (userData.phone && !orderData.has('user_phone')) {
        orderData.append('user_phone', userData.phone);
      }
    }

    console.log('📦 البيانات النهائية للطلب:', finalOrderData);
    
    let lastError = null;
    
    // جرب كل endpoint حتى يجد واحد يعمل
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`🔄 جرب endpoint ${i + 1}/${endpoints.length}: ${endpoint}`);
      
      try {
        const response = await axios.post(endpoint, finalOrderData, { headers });
        
        console.log(`✅ نجح endpoint ${i + 1}: ${endpoint}`);
        console.log('✅ تم إنشاء الطلب بنجاح:', response.data);
        
        // حفظ الطلب في localStorage للتزامن
        const orderData = response.data.data || response.data;
        if (orderData && orderData.id) {
          // حفظ في localStorage لضمان ظهور فوري في الداشبورد
          const savedOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
          savedOrders.unshift(orderData); // إضافة في البداية
          localStorage.setItem('recentOrders', JSON.stringify(savedOrders.slice(0, 50))); // احتفظ بآخر 50 طلب
          console.log('💾 تم حفظ الطلب في localStorage:', orderData.id);
        }
        
        // إرسال إشارة للداشبورد أن طلب جديد تم إضافته
        window.dispatchEvent(new CustomEvent('newOrderAdded', { 
          detail: response.data 
        }));
        
        return response;
        
      } catch (error) {
        lastError = error;
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        console.warn(`❌ فشل endpoint ${i + 1}: ${endpoint} - Status: ${status} - ${message}`);
        
        // إذا كان آخر endpoint، انتقل للخطأ
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
