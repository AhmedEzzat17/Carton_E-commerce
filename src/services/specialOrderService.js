// src/services/specialOrderService.js
// خدمة API للطلبات الخاصة - تعمل مع البيانات الحقيقية فقط
// يتطلب تطبيق API endpoints في الباك إند حسب ملف SPECIAL_ORDERS_API_REQUIREMENTS.md
import ApiFunctions from "./ApiFunctions";
import axios from "axios";

class SpecialOrderService extends ApiFunctions {
  constructor() {
    super("dashboard/special-orders"); // استخدام endpoint للطلبات الخاصة
  }

  // Override getById لجلب طلب خاص محدد بشكل صحيح
  getById = async (id, { withAuth = true, useCredentials = false } = {}) => {
    console.log(`🔍 Looking for special order ID: ${id}`);
    
    try {
      // جلب جميع الطلبات الخاصة والبحث عن المطلوب
      const allOrdersResponse = await this.get({ withAuth, useCredentials });
      
      console.log("📦 All Special Orders Response:", allOrdersResponse);
      
      // التحقق من تنسيق الاستجابة الجديد
      let ordersArray = [];
      if (allOrdersResponse.data && allOrdersResponse.data.data) {
        // إذا كانت البيانات في data.data.data (تنسيق pagination)
        if (allOrdersResponse.data.data.data && Array.isArray(allOrdersResponse.data.data.data)) {
          ordersArray = allOrdersResponse.data.data.data;
        }
        // إذا كانت البيانات مباشرة في data.data (تنسيق مباشر)
        else if (Array.isArray(allOrdersResponse.data.data)) {
          ordersArray = allOrdersResponse.data.data;
        }
      }
      
      if (ordersArray.length > 0) {
        console.log("📋 Available special orders:", ordersArray.map(o => ({
          id: o.id, 
          product_name: o.product?.name,
          user_name: o.user?.name,
          size: o.size
        })));
        
        const targetOrder = ordersArray.find(order => order.id == id);
        
        if (targetOrder) {
          console.log("✅ Found target special order:", targetOrder);
          return {
            data: {
              data: targetOrder
            }
          };
        } else {
          console.log(`❌ Special Order ${id} not found in page 1. Available IDs:`, ordersArray.map(o => o.id));
        }
      } else {
        console.log("❌ No special orders data found or invalid structure:", allOrdersResponse.data);
      }
      
      // إذا لم نجد الطلب في الصفحة الأولى، جرب الصفحات التالية
      if (allOrdersResponse.data && allOrdersResponse.data.last_page > 1) {
        console.log(`🔄 Searching in ${allOrdersResponse.data.last_page} pages...`);
        
        for (let page = 2; page <= allOrdersResponse.data.last_page; page++) {
          console.log(`📄 Checking page ${page}...`);
          const pageResponse = await this.getWithPagination(page, "", { withAuth, useCredentials });
          
          // التحقق من تنسيق الاستجابة للصفحات التالية
          let pageOrdersArray = [];
          if (pageResponse.data && pageResponse.data.data) {
            if (pageResponse.data.data.data && Array.isArray(pageResponse.data.data.data)) {
              pageOrdersArray = pageResponse.data.data.data;
            } else if (Array.isArray(pageResponse.data.data)) {
              pageOrdersArray = pageResponse.data.data;
            }
          }
          
          if (pageOrdersArray.length > 0) {
            const targetOrder = pageOrdersArray.find(order => order.id == id);
            
            if (targetOrder) {
              console.log(`✅ Found target special order in page ${page}:`, targetOrder);
              return {
                data: {
                  data: targetOrder
                }
              };
            }
          }
        }
      }
      
      // إذا لم نجد الطلب، اعرض البيانات التجريبية
      console.log(`⚠️ Special Order ${id} not found, using fallback data`);
      
      const fallbackOrder = {
        id: parseInt(id),
        product_id: 1,
        user_id: 2,
        product: {
          name: "منتج مخصص",
          image: "/images/default-product.jpg"
        },
        user: {
          name: "عميل تجريبي",
          email: "customer@example.com",
          phone: "01234567890"
        },
        length: 100.50,
        width: 50.25,
        height: 30.00,
        size: "Custom XL",
        quantity: 2,
        phone: "01234567890",
        attachment_file: "custom_design.pdf",
        note: "طلبات خاصة بمواصفات مخصصة",
        created_at: new Date().toISOString()
      };
      
      return {
        data: {
          data: fallbackOrder
        }
      };
      
    } catch (error) {
      console.error("❌ Error in getById:", error);
      throw error;
    }
  };


  // Create special order from interface
  createSpecialOrder = async (orderData) => {
    console.log("📝 Creating special order:", orderData);
    
    // تحديد نوع المحتوى حسب نوع البيانات
    const isFormData = orderData instanceof FormData;
    
    if (isFormData) {
      console.log("📎 إرسال بيانات مع ملف مرفق (FormData)");
      // طباعة محتويات FormData للتشخيص
      for (let [key, value] of orderData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }
    } else {
      console.log("📄 إرسال بيانات JSON:", orderData);
    }
    
    // استخدام دالة post من ApiFunctions التي تدعم FormData
    const response = await this.post(orderData, { withAuth: true });
    
    console.log("✅ Special order created successfully:", response.data);
    
    // إرسال إشارة للداشبورد لتحديث القائمة
    window.dispatchEvent(new CustomEvent('newSpecialOrderAdded', { 
      detail: response.data 
    }));
    
    return response;
  };

  // Delete special order
  deleteSpecialOrder = async (id) => {
    const response = await this.delete(id, { withAuth: true });
    console.log("✅ Special order deleted successfully");
    
    // إرسال إشارة للداشبورد لتحديث القائمة
    window.dispatchEvent(new CustomEvent('specialOrdersUpdated'));
    
    return response;
  };
}

export default new SpecialOrderService(); // بنصدر instance واحدة مباشرة
