import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUser, FaPhone, FaEnvelope, FaEdit,
    FaMapMarkerAlt, FaPlus, FaBox, FaHistory,
    FaTruck, FaCheckCircle, FaTimesCircle, FaClock,
    FaTrash, FaArrowLeft, FaCheck
} from 'react-icons/fa';

const Profile = () => {
    // User data state
    const [userData, setUserData] = useState({
        name: 'أحمد محمد',
        phone: '+201234567890',
        email: 'ahmed@example.com',
        isEditing: false
    });

    // Addresses state
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            title: 'المنزل',
            details: '123 شارع التحرير، القاهرة، مصر',
            isDefault: true
        },
        {
            id: 2,
            title: 'العمل',
            details: '456 شارع جامعة الدول العربية، المهندسين، الجيزة',
            isDefault: false
        }
    ]);

    // New address form state
    const [newAddress, setNewAddress] = useState({
        title: '',
        details: '',
        isDefault: false
    });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    // Orders state
    const [orders, setOrders] = useState([
        {
            id: 'ORD-2023-001',
            date: '2023-10-15',
            status: 'تم التوصيل',
            total: 1250,
            items: [
                { name: 'حذاء رياضي', price: 500, quantity: 1 },
                { name: 'تيشيرت', price: 250, quantity: 3 }
            ],
            tracking: 'TRK123456789',
            showDetails: false
        },
        {
            id: 'ORD-2023-002',
            date: '2023-10-10',
            status: 'جارٍ التوصيل',
            total: 750,
            items: [
                { name: 'بنطلون جينز', price: 750, quantity: 1 }
            ],
            tracking: 'TRK987654321',
            showDetails: false
        }
    ]);

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserData(prev => ({ ...prev, isEditing: false }));
        // Here you would typically update the user data in your backend
        console.log('User data updated:', userData);
    };

    // Address handlers
    const handleAddressInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        if (editingAddressId) {
            // Update existing address
            setAddresses(addresses.map(addr =>
                addr.id === editingAddressId
                    ? { ...newAddress, id: editingAddressId }
                    : newAddress.isDefault ? { ...addr, isDefault: false } : addr
            ));
            setEditingAddressId(null);
        } else {
            // Add new address
            const newId = Math.max(0, ...addresses.map(a => a.id)) + 1;
            setAddresses(prev => [
                ...prev.map(addr => newAddress.isDefault ? { ...addr, isDefault: false } : addr),
                { ...newAddress, id: newId }
            ]);
        }
        setNewAddress({ title: '', details: '', isDefault: false });
        setShowAddressForm(false);
    };

    const handleEditAddress = (address) => {
        setNewAddress({
            title: address.title,
            details: address.details,
            isDefault: address.isDefault
        });
        setEditingAddressId(address.id);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
            setAddresses(addresses.filter(addr => addr.id !== id));
        }
    };

    const handleSetDefaultAddress = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const toggleOrderDetails = (orderId) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? { ...order, showDetails: !order.showDetails }
                : order
        ));
    };

    // Tabs state
    const [activeTab, setActiveTab] = useState('profile');

    // Logout function
    const handleLogout = (e) => {
        e.preventDefault();
        // This will trigger the logout modal in the Navbar component
        document.dispatchEvent(new CustomEvent('showLogoutModal'));
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>الملف الشخصي</h1>
                <p> مرحباً بك &nbsp;
                    <span>
                        {(() => {
                            try {
                                const userData = JSON.parse(localStorage.getItem('user'));
                                return userData?.user?.name || 'المستخدم';
                            } catch {
                                return 'المستخدم';
                            }
                        })()}
                    </span>

                </p>
            </div>

            <div className="profile-tabs">
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <div className="d-flex">
                        <button
                            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <FaUser className="tab-icon" /> البيانات الشخصية
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            <FaMapMarkerAlt className="tab-icon" /> العناوين
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <FaBox className="tab-icon" /> طلباتي
                        </button>
                    </div>
                    <button
                        className="btn btn-outline-danger log-out-pro"
                        onClick={handleLogout}
                    >
                        <i className="bx bx-log-out me-1"></i> تسجيل الخروج
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>البيانات الشخصية</h2>
                            {!userData.isEditing && (
                                <button
                                    className="edit-btn"
                                    onClick={() => setUserData(prev => ({ ...prev, isEditing: true }))}
                                >
                                    <FaEdit /> تعديل
                                </button>
                            )}
                        </div>

                        {userData.isEditing ? (
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-group">
                                    <label>الاسم بالكامل</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value=
                                        {userData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="save-btn">حفظ التغييرات</button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setUserData(prev => ({ ...prev, isEditing: false }))}
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info" dir="ltr">
                                <div className="info-item">
                                    <FaUser className="info-icon" />
                                    <div>
                                        <span className="info-value">
                                            <span className="info-label">الاسم:</span>
                                            <span>
                                                {(() => {
                                                    try {
                                                        const userData = JSON.parse(localStorage.getItem('user'));
                                                        return userData?.user?.name || 'المستخدم';
                                                    } catch {
                                                        return 'المستخدم';
                                                    }
                                                })()}
                                            </span>

                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaPhone className="info-icon" />
                                    <div>
                                        <span className="info-label">رقم الهاتف:</span>
                                        <span className="info-value"><span>
                                            {(() => {
                                                try {
                                                    const userData = JSON.parse(localStorage.getItem('user'));
                                                    return userData?.user?.phone || 'الهاتف';
                                                } catch {
                                                    return 'الهاتف';
                                                }
                                            })()}
                                        </span></span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaEnvelope className="info-icon" />
                                    <div>
                                        <span className="info-value"><span>
                                            {(() => {
                                                try {
                                                    const userData = JSON.parse(localStorage.getItem('user'));
                                                    return userData?.user?.email || 'البريد';
                                                } catch {
                                                    return 'البريد';
                                                }
                                            })()}
                                        </span></span>
                                        <span className="info-label">:البريد الإلكتروني</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div className="addresses-section">
                        <div className="section-header">
                            <h2>عناويني</h2>
                            <button
                                className="add-address-btn"
                                onClick={() => {
                                    setNewAddress({ title: '', details: '', isDefault: false });
                                    setEditingAddressId(null);
                                    setShowAddressForm(!showAddressForm);
                                }}
                            >
                                <FaPlus /> {showAddressForm ? 'إلغاء' : 'إضافة عنوان جديد'}
                            </button>
                        </div>

                        {showAddressForm && (
                            <div className="address-form-container">
                                <h3>{editingAddressId ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h3>
                                <form onSubmit={handleAddAddress} className="address-form">
                                    <div className="form-group">
                                        <label>عنوان مميز (مثال: المنزل، العمل)</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newAddress.title}
                                            onChange={handleAddressInputChange}
                                            required
                                            placeholder="مثال: المنزل، العمل"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>تفاصيل العنوان</label>
                                        <textarea
                                            name="details"
                                            value={newAddress.details}
                                            onChange={handleAddressInputChange}
                                            required
                                            rows="3"
                                            placeholder="الشارع، المدينة، المحافظة، الرمز البريدي"
                                        ></textarea>
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="default-address"
                                            name="isDefault"
                                            checked={newAddress.isDefault}
                                            onChange={handleAddressInputChange}
                                        />
                                        <label htmlFor="default-address">تعيين كعنوان افتراضي</label>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="save-btn">
                                            {editingAddressId ? 'تحديث العنوان' : 'إضافة العنوان'}
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => setShowAddressForm(false)}
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="addresses-grid">
                            {addresses.length === 0 ? (
                                <div className="no-addresses">
                                    <FaMapMarkerAlt className="empty-icon" />
                                    <p>لا توجد عناوين مضافة</p>
                                </div>
                            ) : (
                                addresses.map(address => (
                                    <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                                        {address.isDefault && <div className="default-badge">افتراضي</div>}
                                        <h3>{address.title}</h3>
                                        <p>{address.details}</p>
                                        <div className="address-actions">
                                            <button
                                                className="edit-address-btn"
                                                onClick={() => handleEditAddress(address)}
                                            >
                                                <FaEdit /> تعديل
                                            </button>
                                            {!address.isDefault && (
                                                <button
                                                    className="delete-address-btn"
                                                    onClick={() => handleDeleteAddress(address.id)}
                                                >
                                                    <FaTrash /> حذف
                                                </button>
                                            )}
                                            {!address.isDefault && (
                                                <button
                                                    className="set-default-btn"
                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                >
                                                    <FaCheck /> تعيين كافتراضي
                                                </button>
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
                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <FaBox className="empty-icon" />
                                <p>لا توجد طلبات سابقة</p>
                                <Link to="/products" className="browse-btn">تصفح المنتجات</Link>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <span className="order-id">طلب # {order.id}</span>
                                                <span className="order-date">
                                                    {new Date(order.date).toLocaleDateString('ar-EG', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className={`order-status ${order.status === 'تم التوصيل' ? 'delivered' : 'shipping'}`}>
                                                {order.status === 'تم التوصيل' ? (
                                                    <FaCheckCircle className="status-icon" />
                                                ) : (
                                                    <FaTruck className="status-icon" />
                                                )}
                                                {order.status}
                                            </div>
                                        </div>

                                        <div className="order-items">
                                            {order.items.slice(0, order.showDetails ? order.items.length : 2).map((item, index) => (
                                                <div key={index} className="order-item">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-quantity">× {item.quantity}</span>
                                                    <span className="item-price">{item.price * item.quantity} ر.س</span>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && !order.showDetails && (
                                                <button
                                                    className="show-more-items"
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                >
                                                    + {order.items.length - 2} عناصر أخرى
                                                </button>
                                            )}
                                        </div>

                                        <div className="order-footer">
                                            <div className="order-total">
                                                <span>المجموع:</span>
                                                <span className="total-amount">{order.total} ر.س</span>
                                            </div>
                                            <div className="order-actions">
                                                {order.tracking && (
                                                    <a
                                                        href={`/tracking/${order.tracking}`}
                                                        className="track-order-btn"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <FaTruck /> تتبع الشحنة
                                                    </a>
                                                )}
                                                <button
                                                    className="order-details-btn"
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                >
                                                    {order.showDetails ? 'إخفاء التفاصيل' : 'تفاصيل الطلب'}
                                                </button>
                                            </div>
                                        </div>

                                        {order.showDetails && (
                                            <div className="order-details">
                                                <h4>تفاصيل الطلب</h4>
                                                <div className="order-details-grid">
                                                    <div className="detail-item">
                                                        <span className="detail-label">رقم الطلب:</span>
                                                        <span className="detail-value">{order.id}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-label">تاريخ الطلب:</span>
                                                        <span className="detail-value">
                                                            {new Date(order.date).toLocaleDateString('ar-EG', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-label">حالة الطلب:</span>
                                                        <span className="detail-value">{order.status}</span>
                                                    </div>
                                                    {order.tracking && (
                                                        <div className="detail-item">
                                                            <span className="detail-label">رقم التتبع:</span>
                                                            <span className="detail-value">{order.tracking}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <h4>العناصر المطلوبة</h4>
                                                <div className="order-items-details">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="order-item-detail">
                                                            <div className="item-info">
                                                                <span className="item-name">{item.name}</span>
                                                                <span className="item-price">{item.price} ر.س × {item.quantity}</span>
                                                            </div>
                                                            <div className="item-subtotal">
                                                                {item.price * item.quantity} ر.س
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="order-summary">
                                                    <div className="summary-row">
                                                        <span>المجموع الفرعي:</span>
                                                        <span>{order.total}ر.س</span>
                                                    </div>
                                                    <div className="summary-row">
                                                        <span>الشحن:</span>
                                                        <span>مجاناً</span>
                                                    </div>
                                                    <div className="summary-row total">
                                                        <span>الإجمالي:</span>
                                                        <span>{order.total}ر.س</span>
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