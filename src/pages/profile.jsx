import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaBox,
  FaTruck,
  FaCheck,
  FaTrash,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import OrderService from '../services/interface/orderService';

// NOTE: This component focuses on logic fixes requested by the user:
// - Replace native alert() calls with an in-app toast message (green top-left).
// - Make addresses add/update/delete work reliably even when API fails by falling back to localStorage.
// - Fix bugs in string/template usage for headers and classNames.
// - Keep the UI structure the same but don't change styling (user said "no design").

const Profile = () => {
  // Loading states
  const [loading, setLoading] = useState({ profile: false, addresses: false, orders: false });

  // Toast message state (top-left, green for success)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Get user data from localStorage safely
  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      return userData?.user || {};
    } catch (err) {
      return {};
    }
  };

  // User data state - initialized from localStorage
  const [userData, setUserData] = useState(() => {
    const user = getUserData();
    return { name: user.name || '', phone: user.phone || '', phone2: user.phone2 || '', email: user.email || '', isEditing: false };
  });

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  // New address form state
  const [newAddress, setNewAddress] = useState({ title: '', details: '', isDefault: false });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);

  // Tabs state
  const [activeTab, setActiveTab] = useState('profile');

  // API Base URL - adjust this to your actual API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://myappapi.fikriti.com/api/v1';

  // Get auth token
  const getAuthToken = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      return userData?.token || '';
    } catch {
      return '';
    }
  };

  // API headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`
  });

  // Utility: show toast
  const showToast = (message, type = 'success', ms = 3000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), ms);
  };

  // Load user addresses when tab active
  useEffect(() => {
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  // Load orders when orders tab active
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  // Update user profile - LOCAL STORAGE VERSION (temporary)
  const updateUserProfile = async (profileData) => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      const currentUserData = JSON.parse(localStorage.getItem('user')) || {};
      const updatedUserData = { ...currentUserData, user: { ...currentUserData.user, name: profileData.name, phone: profileData.phone, phone2: profileData.phone2, email: profileData.email } };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      return { success: true, data: updatedUserData };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Fetch user addresses - try API, fallback to localStorage
  const fetchAddresses = async () => {
    try {
      setLoading(prev => ({ ...prev, addresses: true }));
      const response = await fetch(`${API_BASE_URL}/user/addresses`, { headers: getHeaders() });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setAddresses(result.addresses || result.data || []);
      } else {
        // fallback
        console.warn('API failed to fetch addresses, using localStorage fallback');
        const local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
        setAddresses(local);
      }
    } catch (error) {
      console.warn('Error fetching addresses, using localStorage fallback', error);
      const local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
      setAddresses(local);
    } finally {
      setLoading(prev => ({ ...prev, addresses: false }));
    }
  };

  // Save addresses to local fallback store
  const saveAddressesToLocal = (list) => {
    try {
      localStorage.setItem('local_addresses', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save local addresses', e);
    }
  };

  // Add or update address - try API, fallback to localStorage
  const saveAddress = async (addressData) => {
    // Normalize data
    const payload = { title: addressData.title, details: addressData.details, isDefault: !!addressData.isDefault };
    // If editing, editingAddressId is set
    try {
      const url = editingAddressId ? `${API_BASE_URL}/user/addresses/${editingAddressId}` : `${API_BASE_URL}/user/addresses`;
      const method = editingAddressId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        // refresh from API
        await fetchAddresses();
        return { success: true };
      } else {
        // fallback to local save
        console.warn('API saveAddress failed, falling back to local storage', result);
        let local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
        if (editingAddressId) {
          local = local.map(a => (a.id === editingAddressId ? { ...a, ...payload } : a));
        } else {
          // assign a new id
          const newId = Date.now();
          const newAddr = { id: newId, ...payload };
          // if new address is default, unset others
          if (newAddr.isDefault) local = local.map(a => ({ ...a, isDefault: false }));
          local = [newAddr, ...local];
        }
        saveAddressesToLocal(local);
        setAddresses(local);
        return { success: true, fallback: true };
      }
    } catch (error) {
      console.warn('Error saving address, using localStorage fallback', error);
      // local fallback
      let local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
      if (editingAddressId) {
        local = local.map(a => (a.id === editingAddressId ? { ...a, ...payload } : a));
      } else {
        const newId = Date.now();
        const newAddr = { id: newId, ...payload };
        if (newAddr.isDefault) local = local.map(a => ({ ...a, isDefault: false }));
        local = [newAddr, ...local];
      }
      saveAddressesToLocal(local);
      setAddresses(local);
      return { success: true, fallback: true };
    }
  };

  // Delete address - try API, fallback to local
  const deleteAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, { method: 'DELETE', headers: getHeaders() });
      if (response.ok) {
        await fetchAddresses();
        return { success: true };
      } else {
        const result = await response.json().catch(() => ({}));
        console.warn('API delete failed, falling back to local', result);
        let local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
        local = local.filter(a => a.id !== addressId);
        saveAddressesToLocal(local);
        setAddresses(local);
        return { success: true, fallback: true };
      }
    } catch (error) {
      console.warn('Error deleting address, using localStorage fallback', error);
      let local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
      local = local.filter(a => a.id !== addressId);
      saveAddressesToLocal(local);
      setAddresses(local);
      return { success: true, fallback: true };
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}/default`, { method: 'PUT', headers: getHeaders() });
      if (response.ok) {
        await fetchAddresses();
        return { success: true };
      } else {
        console.warn('API setDefault failed, falling back to local');
        let local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
        local = local.map(a => ({ ...a, isDefault: a.id === addressId }));
        saveAddressesToLocal(local);
        setAddresses(local);
        return { success: true, fallback: true };
      }
    } catch (error) {
      console.warn('Error setting default address, using local fallback', error);
      let local = JSON.parse(localStorage.getItem('local_addresses') || '[]');
      local = local.map(a => ({ ...a, isDefault: a.id === addressId }));
      saveAddressesToLocal(local);
      setAddresses(local);
      return { success: true, fallback: true };
    }
  };

  // Fetch user orders using OrderService - الطلبات الحقيقية فقط
  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      
      console.log('🔄 جاري تحميل الطلبات الحقيقية من API...');
      
      let response;
      
      try {
        // المحاولة الأولى: استخدام OrderService
        response = await OrderService.getUserOrders({ withAuth: true });
        console.log('✅ تم تحميل الطلبات بنجاح');
      } catch (firstError) {
        console.warn('⚠️ فشلت المحاولة الأولى، جرب الدالة البديلة...');
        
        // المحاولة الثانية: استخدام axios مباشر
        response = await OrderService.getUserOrdersDirect({ withAuth: true });
        console.log('✅ تم تحميل الطلبات بالدالة البديلة');
      }
      
      console.log('📡 استجابة API:', response.data);
      
      if (response.data) {
        // معالجة البيانات من API - فحص هيكل البيانات
        let ordersData = [];
        
        if (response.data.data) {
          // إذا كانت البيانات في response.data.data
          if (Array.isArray(response.data.data)) {
            ordersData = response.data.data;
          } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
            // إذا كانت البيانات في response.data.data.data
            ordersData = response.data.data.data;
          } else {
            console.warn('⚠️ هيكل البيانات غير متوقع:', response.data.data);
            ordersData = [];
          }
        } else if (Array.isArray(response.data)) {
          // إذا كانت البيانات مباشرة في response.data
          ordersData = response.data;
        } else {
          console.warn('⚠️ لا يمكن العثور على array في البيانات:', response.data);
          ordersData = [];
        }
        
        console.log('📊 البيانات المستخرجة:', ordersData);
        
        if (Array.isArray(ordersData)) {
          console.log('🔍 عينة من البيانات الخام:', ordersData[0]);
          
          const ordersWithDetails = ordersData.map(order => {
            // معالجة شاملة لجميع الحقول المحتملة
            const processedOrder = {
              ...order,
              showDetails: false,
              // معالجة ID
              id: order.id || order.order_id || order.order_number || Math.random(),
              // معالجة رقم الطلب
              order_number: order.order_number || order.id || 'غير محدد',
              // معالجة العناصر
              items: order.items || order.order_items || order.products || [],
              // معالجة المجموع
              total: order.total || order.total_amount || order.amount || 0,
              // معالجة التاريخ
              date: order.date || order.created_at || order.order_date || new Date().toISOString(),
              // معالجة الحالة
              status: order.status || order.order_status || 'pending',
              // معالجة الملاحظات
              notes: order.notes || order.order_notes || '',
              // معالجة طريقة الدفع
              payment_method: order.payment_method || order.paymentMethod || 'غير محدد',
              // معالجة العنوان
              shipping_address: order.shipping_address || order.address || order.delivery_address || 'غير محدد'
            };
            
            // معالجة العناصر إذا كانت string JSON
            if (typeof processedOrder.items === 'string') {
              try {
                processedOrder.items = JSON.parse(processedOrder.items);
              } catch (e) {
                processedOrder.items = [];
              }
            }

            // معالجة order_items من API الجديد - أولوية للبيانات الحقيقية
            if (order.order_items && Array.isArray(order.order_items)) {
              processedOrder.items = order.order_items.map(orderItem => ({
                name: orderItem.product?.name || orderItem.name || 'منتج غير محدد',
                product_name: orderItem.product?.name || orderItem.product_name,
                title: orderItem.product?.name || orderItem.title,
                quantity: orderItem.quantity || 1,
                price: orderItem.unit_price || orderItem.price || 0,
                product_price: orderItem.unit_price || orderItem.product_price,
                unit_price: orderItem.unit_price,
                subtotal: orderItem.subtotal || 0,
                product_id: orderItem.product_id || orderItem.id,
                description: orderItem.product?.description || orderItem.description
              }));
              console.log('🔍 معالجة order_items للطلب:', order.id, 'عدد العناصر:', processedOrder.items.length);
            }
            
            // معالجة العنوان إذا كان string JSON
            if (typeof processedOrder.shipping_address === 'string') {
              try {
                const addressObj = JSON.parse(processedOrder.shipping_address);
                processedOrder.shipping_address = addressObj.address || addressObj || processedOrder.shipping_address;
              } catch (e) {
                // إبقاء العنوان كما هو إذا لم يكن JSON
              }
            }
            
            return processedOrder;
          });
          
          console.log('🔍 عينة من البيانات المعالجة:', ordersWithDetails[0]);
          console.log('📊 عدد العناصر في أول طلب:', ordersWithDetails[0]?.items?.length || 0);
          
          setOrders(ordersWithDetails);
          console.log(`✅ تم تحميل ${ordersWithDetails.length} طلب حقيقي`);
          
          if (ordersWithDetails.length === 0) {
            console.log('ℹ️ لا توجد طلبات حقيقية للمستخدم');
          }
        } else {
          console.error('❌ البيانات ليست array:', typeof ordersData, ordersData);
          setOrders([]);
        }
      } else {
        console.warn('⚠️ لا توجد بيانات في الاستجابة');
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل الطلبات:', error);
      
      if (error.response) {
        console.error('❌ خطأ من السيرفر:', error.response.status, error.response.data);
        if (error.response.status !== 500) {
          showToast('خطأ في تحميل الطلبات', 'error');
        }
      } else if (error.request) {
        console.error('❌ خطأ في الشبكة:', error.request);
        showToast('خطأ في الاتصال بالخادم', 'error');
      } else {
        console.error('❌ خطأ عام:', error.message);
        showToast('حدث خطأ غير متوقع', 'error');
      }
      
      setOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUserProfile({ name: userData.name, phone: userData.phone, phone2: userData.phone2, email: userData.email });
    if (result.success) {
      setUserData(prev => ({ ...prev, isEditing: false }));
      showToast('تم تحديث البيانات بنجاح!', 'success');
    } else {
      showToast(`خطأ: ${result.error || 'حدث خطأ'}`, 'error');
    }
  };

  // Address handlers
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newAddress.title.trim() || !newAddress.details.trim()) {
      showToast('يرجى إدخال عنوان وتفاصيل صحيحة', 'error');
      return;
    }

    const result = await saveAddress({ title: newAddress.title.trim(), details: newAddress.details.trim(), isDefault: newAddress.isDefault });
    if (result.success) {
      const msg = editingAddressId ? 'تم تحديث العنوان بنجاح!' : 'تم إضافة العنوان بنجاح!';
      showToast(msg, 'success');
      // reset form
      setNewAddress({ title: '', details: '', isDefault: false });
      setShowAddressForm(false);
      setEditingAddressId(null);
    } else {
      showToast(`خطأ: ${result.error || 'فشل حفظ العنوان'}`, 'error');
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress({ title: address.title || '', details: address.details || '', isDefault: !!address.isDefault });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    // confirmed via window.confirm because the user didn't ask to change confirm UI
    if (window.confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
      const result = await deleteAddress(id);
      if (result.success) {
        showToast('تم حذف العنوان بنجاح!', 'success');
      } else {
        showToast(`خطأ: ${result.error || 'فشل الحذف'}`, 'error');
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const result = await setDefaultAddress(id);
    if (result.success) {
      showToast('تم تعيين العنوان الافتراضي بنجاح!', 'success');
    } else {
      showToast(`خطأ: ${result.error || 'فشل التعيين'}`, 'error');
    }
  };

  const toggleOrderDetails = (orderId) => {
    setOrders((orders || []).map(order => order.id === orderId ? { ...order, showDetails: !(order.showDetails) } : order));
  };

  // Logout function
  const handleLogout = (e) => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('showLogoutModal'));
  };

  // Get current user data for display
  const currentUser = getUserData();

  return (
    <div className="profile-container">
      {/* Toast top-left */}
      {toast.visible && (
        <div className={`app-toast ${toast.type === 'success' ? 'success' : 'error'}`} style={{ position: 'fixed', top: 16, left: 16, background: '#dff7e6', color: '#065f46', padding: '10px 14px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', zIndex: 9999 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaCheck />
            <div>{toast.message}</div>
          </div>
        </div>
      )}

      <div className="profile-header">
        <h1>الملف الشخصي</h1>
        <p> مرحباً بك &nbsp; <span>{currentUser.name || 'المستخدم'}</span> </p>
      </div>

      <div className="profile-tabs">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div className="d-flex">
            <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <FaUser className="tab-icon" /> البيانات الشخصية
            </button>
            {/* <button className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              <FaMapMarkerAlt className="tab-icon" /> العناوين
            </button> */}
            <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <FaBox className="tab-icon" /> طلباتي
            </button>
          </div>

          <button className="btn btn-outline-danger log-out-pro" onClick={handleLogout}>
            <i className="bx bx-log-out me-1"></i> تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>البيانات الشخصية</h2>
              {/* {!userData.isEditing && (
                <button className="edit-btn" onClick={() => setUserData(prev => ({ ...prev, isEditing: true }))}>
                  <FaEdit /> تعديل
                </button>
              )} */}
            </div>

            {userData.isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>الاسم بالكامل</label>
                  <input type="text" name="name" value={userData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف الأول</label>
                  <input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف الثاني (اختياري)</label>
                  <input type="tel" name="phone2" value={userData.phone2} onChange={handleInputChange} placeholder="رقم هاتف إضافي" />
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" name="email" value={userData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading.profile}>{loading.profile ? <FaSpinner className="fa-spin" /> : null} حفظ التغييرات</button>
                  <button type="button" className="cancel-btn" onClick={() => setUserData(prev => ({ ...prev, isEditing: false }))}>إلغاء</button>
                </div>
              </form>
            ) : (
              <div className="profile-info" dir="ltr">
                <div className="info-item"><FaUser className="info-icon" />
                  <div><span className="info-value">{currentUser.name || 'غير محدد'}</span> <span className="info-label me-2">:الاسم</span></div>
                </div>

                <div className="info-item"><FaPhone className="info-icon" />
                  <div><span className="info-label me-2">رقم الهاتف الأول:</span> <span className="info-value">{currentUser.phone || 'غير محدد'}</span></div>
                </div>

                <div className="info-item"><FaPhone className="info-icon" />
                  <div><span className="info-label me-2">رقم الهاتف الثاني:</span> <span className="info-value">{currentUser.phone2 || 'لم يتم إضافته'}</span></div>
                </div>

                <div className="info-item"><FaEnvelope className="info-icon" />
                  <div><span className="info-value">{currentUser.email || 'غير محدد'}</span> <span className="info-label me-2">:البريد الإلكتروني</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="addresses-section">
            <div className="section-header">
              <h2>عناويني</h2>
              <button className="add-address-btn" onClick={() => { setNewAddress({ title: '', details: '', isDefault: false }); setEditingAddressId(null); setShowAddressForm(prev => !prev); }}>
                <FaPlus /> {showAddressForm ? 'إلغاء' : 'إضافة عنوان جديد'}
              </button>
            </div>

            {loading.addresses && (
              <div className="loading-container"><FaSpinner className="fa-spin" /> جاري تحميل العناوين...</div>
            )}

            {showAddressForm && (
              <div className="address-form-container">
                <h3>{editingAddressId ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h3>
                <form onSubmit={handleAddAddress} className="address-form">
                  <div className="form-group">
                    <label>عنوان مميز (مثال: المنزل، العمل)</label>
                    <input type="text" name="title" value={newAddress.title} onChange={handleAddressInputChange} required placeholder="مثال: المنزل، العمل" />
                  </div>
                  <div className="form-group">
                    <label>تفاصيل العنوان</label>
                    <textarea name="details" value={newAddress.details} onChange={handleAddressInputChange} required rows="3" placeholder="الشارع، المدينة، المحافظة، الرمز البريدي"></textarea>
                  </div>
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="default-address" name="isDefault" checked={newAddress.isDefault} onChange={handleAddressInputChange} />
                    <label htmlFor="default-address">تعيين كعنوان افتراضي</label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">{editingAddressId ? 'تحديث العنوان' : 'إضافة العنوان'}</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowAddressForm(false)}>إلغاء</button>
                  </div>
                </form>
              </div>
            )}

            <div className="addresses-grid">
              {(!addresses || addresses.length === 0) ? (
                <div className="no-addresses"><FaMapMarkerAlt className="empty-icon" /> <p>لا توجد عناوين مضافة</p></div>
              ) : (
                addresses.map(address => (
                  <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                    {address.isDefault && <div className="default-badge">افتراضي</div>}
                    <h3>{address.title}</h3>
                    <p>{address.details}</p>
                    <div className="address-actions">
                      <button className="edit-address-btn" onClick={() => handleEditAddress(address)}><FaEdit /> تعديل</button>
                      {!address.isDefault && (
                        <>
                          <button className="delete-address-btn" onClick={() => handleDeleteAddress(address.id)}><FaTrash /> حذف</button>
                          <button className="set-default-btn" onClick={() => handleSetDefaultAddress(address.id)}><FaCheck /> تعيين كافتراضي</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>سجل الطلبات</h2>
            {loading.orders && (<div className="loading-container"><FaSpinner className="fa-spin" /> جاري تحميل الطلبات...</div>)}
            {(orders || []).length === 0 && !loading.orders ? (
              <div className="no-orders"><FaBox className="empty-icon" /> <p>لا توجد طلبات سابقة</p> <Link to="/FullRecentProductsPage" className="browse-btn">تصفح المنتجات</Link></div>
            ) : (
              <div className="orders-list">
                {(orders || []).map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">طلب # {order.order_number || order.id}</span>
                        <span className="order-date">{new Date(order.date || order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className={`order-status ${order.status === 'تم التوصيل' || order.status === 'delivered' || order.status === 'completed' ? 'delivered' : 'shipping'}`}>
                        {order.status === 'تم التوصيل' || order.status === 'delivered' || order.status === 'completed' ? (<FaCheckCircle className="status-icon" />) : (<FaTruck className="status-icon" />)}
                        {order.status === 'pending' ? 'قيد المراجعة' : 
                         order.status === 'processing' ? 'قيد التجهيز' :
                         order.status === 'shipped' ? 'تم الشحن' :
                         order.status === 'delivered' ? 'تم التوصيل' :
                         order.status === 'completed' ? 'مكتمل' :
                         order.status === 'cancelled' ? 'ملغي' : order.status}
                      </div>
                    </div>

                    <div className="order-items">
                      {/* عرض العناصر أو رسالة إذا لم توجد */}
                      {(order.items && order.items.length > 0) ? (
                        <>
                          {order.items.slice(0, (order.showDetails ? order.items.length : 2)).map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-name">
                                {item.name || item.product_name || item.title || `منتج ${index + 1}`}
                              </span>
                              <span className="item-quantity">× {item.quantity || 1}</span>
                              <span className="item-price">
                                {(parseFloat(item.price || item.product_price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)} ر.س
                              </span>
                            </div>
                          ))}
                          
                          {order.items.length > 2 && !order.showDetails && (
                            <button className="show-more-items" onClick={() => toggleOrderDetails(order.id)}>
                              + {order.items.length - 2} عناصر أخرى
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="order-item">
                          <span className="item-name">تفاصيل المنتجات غير متاحة</span>
                          <span className="item-quantity">-</span>
                          <span className="item-price">-</span>
                        </div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total"><span>المجموع:</span> <span className="total-amount">{parseFloat(order.total || order.total_amount || 0).toFixed(2)} ر.س</span></div>
                      <div className="order-actions">
                        {(order.tracking) && (<a href={`/tracking/${order.tracking}`} className="track-order-btn" target="_blank" rel="noopener noreferrer"><FaTruck /> تتبع الشحنة</a>)}
                        <button className="order-details-btn" onClick={() => toggleOrderDetails(order.id)}>{(order.showDetails) ? 'إخفاء التفاصيل' : 'تفاصيل الطلب'}</button>
                      </div>
                    </div>

                    {(order.showDetails) && (
                      <div className="order-details">
                        <h4>تفاصيل الطلب</h4>
                        <div className="order-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">رقم الطلب:</span> 
                            <span className="detail-value">{order.order_number || order.id}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">تاريخ الطلب:</span> 
                            <span className="detail-value">
                              {new Date(order.date || order.created_at).toLocaleDateString('ar-EG', { 
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">حالة الطلب:</span> 
                            <span className="detail-value">
                              {order.status === 'pending' ? 'قيد المراجعة' : 
                               order.status === 'processing' ? 'قيد التجهيز' :
                               order.status === 'shipped' ? 'تم الشحن' :
                               order.status === 'delivered' ? 'تم التوصيل' :
                               order.status === 'completed' ? 'مكتمل' :
                               order.status === 'cancelled' ? 'ملغي' : order.status}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">طريقة الدفع:</span> 
                            <span className="detail-value">
                              {order.payment_method === 'cod' || order.payment_method === 'cash_on_delivery' ? 'الدفع عند الاستلام' :
                               order.payment_method === 'bank_transfer' ? 'تحويل بنكي' :
                               order.payment_method || 'غير محدد'}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">عنوان التوصيل:</span> 
                            <span className="detail-value">{order.shipping_address || 'غير محدد'}</span>
                          </div>
                          {order.notes && (
                            <div className="detail-item">
                              <span className="detail-label">ملاحظات:</span> 
                              <span className="detail-value">{order.notes}</span>
                            </div>
                          )}
                          {order.tracking && (
                            <div className="detail-item">
                              <span className="detail-label">رقم التتبع:</span> 
                              <span className="detail-value">{order.tracking}</span>
                            </div>
                          )}
                        </div>

                        <h4>العناصر المطلوبة</h4>
                        <div className="order-items-details">
                          {(order.items && order.items.length > 0) ? (
                            order.items.map((item, index) => (
                              <div key={index} className="order-item-detail">
                                <div className="item-info">
                                  <span className="item-name">
                                    {item.name || item.product_name || item.title || `منتج ${index + 1}`}
                                  </span>
                                  <span className="item-price">
                                    {parseFloat(item.price || item.product_price || item.unit_price || 0).toFixed(2)} ر.س × {item.quantity || 1}
                                  </span>
                                </div>
                                <div className="item-subtotal">
                                  {(parseFloat(item.price || item.product_price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)} ر.س
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="order-item-detail">
                              <div className="item-info">
                                <span className="item-name">تفاصيل المنتجات غير متاحة</span>
                                <span className="item-price">-</span>
                              </div>
                              <div className="item-subtotal">-</div>
                            </div>
                          )}
                        </div>

                        <div className="order-summary">
                          <div className="summary-row">
                            <span>المجموع الفرعي:</span> 
                            <span>{parseFloat(order.subtotal || order.total || order.total_amount || 0).toFixed(2)} ر.س</span>
                          </div>
                          <div className="summary-row">
                            <span>الشحن:</span> 
                            <span>{order.shipping_cost ? `${parseFloat(order.shipping_cost).toFixed(2)} ر.س` : 'مجاناً'}</span>
                          </div>
                          <div className="summary-row total">
                            <span>الإجمالي:</span> 
                            <span>{parseFloat(order.total || order.total_amount || 0).toFixed(2)} ر.س</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
