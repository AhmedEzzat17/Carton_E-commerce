// import React, { useState, useEffect, useRef } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay, Thumbs, EffectFade } from 'swiper/modules';

// // استيراد ملفات CSS الخاصة بـ Swiper
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/autoplay';
// import 'swiper/css/thumbs';
// import 'swiper/css/effect-fade';


// function App() {
//   // --- SearchPopup Logic ---
//   const [isSearchPopupVisible, setIsSearchPopupVisible] = useState(false);
//   const searchInputRef = useRef(null);

//   const toggleSearchPopup = () => {
//     setIsSearchPopupVisible(prev => !prev);
//   };

//   useEffect(() => {
//     if (isSearchPopupVisible && searchInputRef.current) {
//       const timeoutId = setTimeout(() => {
//         searchInputRef.current.focus();
//       }, 350);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [isSearchPopupVisible]);

//   useEffect(() => {
//     const handleKeyUp = (e) => {
//       if (e.key === 'Escape') {
//         setIsSearchPopupVisible(false);
//       }
//     };
//     document.addEventListener('keyup', handleKeyUp);
//     return () => document.removeEventListener('keyup', handleKeyUp);
//   }, []);

//   useEffect(() => {
//     const handleClickOutsideSearch = (e) => {
//       if (
//         isSearchPopupVisible &&
//         !e.target.closest('.search-popup-container') &&
//         !e.target.closest('.search-button') &&
//         !e.target.closest('.search-popup-trigger')
//       ) {
//         setIsSearchPopupVisible(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutsideSearch);
//     return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
//   }, [isSearchPopupVisible]);


//   // --- CountdownTimer Logic ---
//   const calculateTimeRemaining = (endtime) => {
//     const total = Date.parse(new Date(endtime)) - Date.parse(new Date());
//     const seconds = Math.floor((total / 1000) % 60);
//     const minutes = Math.floor((total / 1000 / 60) % 60);
//     const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
//     const days = Math.floor(total / (1000 * 60 * 60 * 24));
//     return { total, days, hours, minutes, seconds };
//   };

//   const twentyEightDaysLater = new Date(Date.parse(new Date()) + 28 * 24 * 60 * 60 * 1000);
//   const [countdownTime, setCountdownTime] = useState(calculateTimeRemaining(twentyEightDaysLater.toISOString()));

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const t = calculateTimeRemaining(twentyEightDaysLater.toISOString());
//       setCountdownTime(t);
//       if (t.total <= 0) {
//         clearInterval(timer);
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [twentyEightDaysLater]); // Depend on deadline to re-run if it changes


//   // --- ProductQuantity Logic ---
//   const [productQuantity, setProductQuantity] = useState(0);

//   const increaseProductQuantity = () => {
//     setProductQuantity(prevQuantity => prevQuantity + 1);
//   };

//   const decreaseProductQuantity = () => {
//     setProductQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
//   };


//   // --- VideoPlayer Logic (Modal) ---
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [currentVideoSrc, setCurrentVideoSrc] = useState('');

//   const handlePlayVideo = (src) => {
//     setCurrentVideoSrc(src);
//     setShowVideoModal(true);
//   };

//   const handleCloseVideoModal = () => {
//     setShowVideoModal(false);
//     setCurrentVideoSrc(''); // Clear video source to stop playback
//   };


//   // --- Swiper Sliders Logic ---
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);


//   // --- FAQ Section Logic ---
//   const [activeFAQItem, setActiveFAQItem] = useState(null);

//   const toggleFAQ = (index) => {
//     setActiveFAQItem(activeFAQItem === index ? null : index);
//   };

//   const faqData = [
//     {
//       question: "What is your return policy?",
//       answer: "You can return items within 30 days of purchase for a full refund."
//     },
//     {
//       question: "How long does shipping take?",
//       answer: "Shipping usually takes 3-5 business days depending on your location."
//     },
//     {
//       question: "Do you offer international shipping?",
//       answer: "Yes, we offer international shipping to most countries."
//     }
//   ];


//   // --- Cart Functionality Logic ---
//   const initialCartItems = [
//     { id: 1, name: 'Product A', quantity: 1, unitPrice: 100.00 },
//     { id: 2, name: 'Product B', quantity: 2, unitPrice: 50.50 },
//     { id: 3, name: 'Product C', quantity: 1, unitPrice: 25.75 },
//   ];

//   const [cartItems, setCartItems] = useState(initialCartItems);

//   const calculateCartTotals = () => {
//     let currentSubtotal = 0;
//     cartItems.forEach(item => {
//       currentSubtotal += item.quantity * item.unitPrice;
//     });
//     return currentSubtotal;
//   };

//   const handleIncreaseCartQuantity = (id) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const handleDecreaseCartQuantity = (id) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
//       )
//     );
//   };

//   const handleRemoveCartItem = (id) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== id));
//   };

//   const cartSubtotal = calculateCartTotals();
//   const cartFinalTotal = cartSubtotal; // Assuming no shipping/tax


//   // --- Scroll to Top Logic ---
//   const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY >= 300) {
//         setShowScrollToTopButton(true);
//       } else {
//         setShowScrollToTopButton(false);
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };


//   // --- Horizontal Scroll Logic ---
//   const horizontalScrollContainerRef = useRef(null);
//   let isDown = useRef(false); // Using useRef for mutable variable without re-rendering
//   let startX = useRef(0);
//   let scrollLeft = useRef(0);

//   const handleMouseDownHorizontalScroll = (e) => {
//     isDown.current = true;
//     if (horizontalScrollContainerRef.current) {
//       horizontalScrollContainerRef.current.classList.add('active');
//       startX.current = e.pageX - horizontalScrollContainerRef.current.offsetLeft;
//       scrollLeft.current = horizontalScrollContainerRef.current.scrollLeft;
//     }
//   };

//   const handleMouseLeaveHorizontalScroll = () => {
//     isDown.current = false;
//     if (horizontalScrollContainerRef.current) {
//       horizontalScrollContainerRef.current.classList.remove('active');
//     }
//   };

//   const handleMouseUpHorizontalScroll = () => {
//     isDown.current = false;
//     if (horizontalScrollContainerRef.current) {
//       horizontalScrollContainerRef.current.classList.remove('active');
//     }
//   };

//   const handleMouseMoveHorizontalScroll = (e) => {
//     if (!isDown.current || !horizontalScrollContainerRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - horizontalScrollContainerRef.current.offsetLeft;
//     const walk = (x - startX.current) * 2;
//     horizontalScrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
//   };


//   // --- Preloader Logic ---
//   const [isPreloaderHidden, setIsPreloaderHidden] = useState(false);

//   useEffect(() => {
//     const handleLoad = () => {
//       setIsPreloaderHidden(true);
//     };
//     window.addEventListener('load', handleLoad);
//     return () => window.removeEventListener('load', handleLoad);
//   }, []);


//   return (
//     <div className="App">
//       {/* Preloader */}
//       <div id="preloader" className={isPreloaderHidden ? 'hide-preloader' : ''}>
//         <div className="spinner"></div> {/* أضف محتوى الـ preloader الخاص بك هنا */}
//       </div>

//       {/* Search Popup */}
//       <nav id="header-nav">
//         <button className="search-button" onClick={toggleSearchPopup}>
//           Search
//         </button>
//         <button className="btn-close-search" onClick={toggleSearchPopup}>
//           Close Search (Example)
//         </button>
//         <button className="search-popup-trigger" onClick={toggleSearchPopup}>
//           Open Search Popup
//         </button>
//       </nav>

//       <div className={`search-popup ${isSearchPopupVisible ? 'is-visible' : ''}`} onClick={(e) => {
//         if (e.target.closest('.search-popup-close') || e.target.classList.contains('search-popup')) {
//           setIsSearchPopupVisible(false);
//         }
//       }}>
//         <div className="search-popup-container">
//           <button className="btn-close-search search-popup-close" onClick={toggleSearchPopup}>
//             Close
//           </button>
//           <input type="text" id="search-popup" ref={searchInputRef} placeholder="Search..." />
//         </div>
//       </div>
//       <hr />

//       {/* Countdown Timer */}
//       <h2>Countdown Timer</h2>
//       <div id="countdown-clock">
//         <span className="days">{countdownTime.days}</span> days
//         <span className="hours">{('0' + countdownTime.hours).slice(-2)}</span> hours
//         <span className="minutes">{('0' + countdownTime.minutes).slice(-2)}</span> minutes
//         <span className="seconds">{('0' + countdownTime.seconds).slice(-2)}</span> seconds
//       </div>
//       <hr />

//       {/* Product Quantity */}
//       <h2>Product Quantity</h2>
//       <div className="product-qty">
//         <button className="quantity-left-minus" onClick={decreaseProductQuantity}>
//           -
//         </button>
//         <input type="text" id="quantity" value={productQuantity} readOnly />
//         <button className="quantity-right-plus" onClick={increaseProductQuantity}>
//           +
//         </button>
//       </div>
//       <hr />

//       {/* Video Player Section */}
//       <h2>Video Player</h2>
//       <div>
//         <button className="play-btn" data-src="https://www.youtube.com/embed/your_video_id" onClick={() => handlePlayVideo("https://www.youtube.com/embed/your_video_id")}>
//           Play Video
//         </button>

//         {showVideoModal && (
//           <div className="modal" id="myModal" style={{ display: 'block' }}>
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <button type="button" className="close" onClick={handleCloseVideoModal}>
//                     &times;
//                   </button>
//                 </div>
//                 <div className="modal-body">
//                   <iframe
//                     id="video"
//                     width="100%"
//                     height="315"
//                     src={currentVideoSrc ? `${currentVideoSrc}?autoplay=1&modestbranding=1&showinfo=0` : ''}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     title="YouTube video player"
//                   ></iframe>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <hr />

//       {/* Swiper Sliders */}
//       <h2>Swiper Sliders</h2>
//       {/* Main Swiper */}
//       <div className="main-swiper-container">
//         <Swiper
//           modules={[Navigation, Autoplay]}
//           speed={500}
//           navigation={{
//             nextEl: '.main-slider-button-next',
//             prevEl: '.main-slider-button-prev',
//           }}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           className="main-swiper"
//         >
//           <SwiperSlide>Main Slide 1</SwiperSlide>
//           <SwiperSlide>Main Slide 2</SwiperSlide>
//           <SwiperSlide>Main Slide 3</SwiperSlide>
//         </Swiper>
//         <div className="main-slider-button-prev">Prev</div>
//         <div className="main-slider-button-next">Next</div>
//       </div>
//       <br />

//       {/* Product Swiper */}
//       <div className="product-swiper-container">
//         <Swiper
//           modules={[Navigation, Autoplay]}
//           spaceBetween={20}
//           navigation={{
//             nextEl: '.product-slider-button-next',
//             prevEl: '.product-slider-button-prev',
//           }}
//           autoplay={{
//             delay: 4000,
//             disableOnInteraction: false,
//           }}
//           breakpoints={{
//             0: { slidesPerView: 1 },
//             660: { slidesPerView: 3 },
//             980: { slidesPerView: 4 },
//             1500: { slidesPerView: 5 },
//           }}
//           className="product-swiper"
//         >
//           <SwiperSlide>Product 1</SwiperSlide>
//           <SwiperSlide>Product 2</SwiperSlide>
//           <SwiperSlide>Product 3</SwiperSlide>
//           <SwiperSlide>Product 4</SwiperSlide>
//           <SwiperSlide>Product 5</SwiperSlide>
//         </Swiper>
//         <div className="product-slider-button-prev">Prev</div>
//         <div className="product-slider-button-next">Next</div>
//       </div>
//       <br />

//       {/* Testimonial Swiper */}
//       <div className="testimonial-swiper-container">
//         <Swiper
//           modules={[Navigation]}
//           slidesPerView={1}
//           spaceBetween={20}
//           navigation={{
//             nextEl: '.testimonial-button-next',
//             prevEl: '.testimonial-button-prev',
//           }}
//           className="testimonial-swiper"
//         >
//           <SwiperSlide>Testimonial 1</SwiperSlide>
//           <SwiperSlide>Testimonial 2</SwiperSlide>
//         </Swiper>
//         <div className="testimonial-button-prev">Prev</div>
//         <div className="testimonial-button-next">Next</div>
//       </div>
//       <br />

//       {/* Thumb and Large Swiper */}
//       <div className="image-gallery-swiper-container">
//         <Swiper
//           onSwiper={setThumbsSwiper}
//           spaceBetween={10}
//           slidesPerView={4}
//           freeMode={true}
//           watchSlidesProgress={true}
//           modules={[Navigation, Thumbs]}
//           className="thumb-swiper"
//         >
//           <SwiperSlide><img src="https://via.placeholder.com/100x100?text=Thumb1" alt="thumb1" /></SwiperSlide>
//           <SwiperSlide><img src="https://via.placeholder.com/100x100?text=Thumb2" alt="thumb2" /></SwiperSlide>
//           <SwiperSlide><img src="https://via.placeholder.com/100x100?text=Thumb3" alt="thumb3" /></SwiperSlide>
//           <SwiperSlide><img src="https://via.placeholder.com/100x100?text=Thumb4" alt="thumb4" /></SwiperSlide>
//         </Swiper>

//         <Swiper
//           spaceBetween={10}
//           effect={"fade"}
//           thumbs={{ swiper: thumbsSwiper }}
//           modules={[EffectFade, Thumbs]}
//           className="large-swiper"
//         >
//           <SwiperSlide><img src="https://via.placeholder.com/400x300?text=Large1" alt="large1" /></SwiperSlide>
//           <SwiperSlide><img src="https://via.placeholder.com/400x300?text=Large2" alt="large2" /></SwiperSlide>
//           <SwiperSlide><img src="https://via.placeholder.com/400x300?text=Large3" alt="large3" /></SwiperSlide>
//           <SwiperSlide><img src="https://via.placeholder.com/400x300?text=Large4" alt="large4" /></SwiperSlide>
//         </Swiper>
//       </div>
//       <br />

//       {/* General Swiper (slider-wrapper) */}
//       <div className="general-slider-container">
//         <Swiper
//           loop={true}
//           spaceBetween={15}
//           pagination={{
//             el: ".swiper-pagination",
//             clickable: true,
//             dynamicBullets: true,
//           }}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           speed={500}
//           centeredSlides={true}
//           centerInsufficientSlides={true}
//           breakpoints={{
//             0: { slidesPerView: 1 },
//             767: { slidesPerView: 2 },
//             992: { slidesPerView: 3 },
//           }}
//           className="slider-wrapper"
//           modules={[Pagination, Autoplay]}
//         >
//           <SwiperSlide>General Slide A</SwiperSlide>
//           <SwiperSlide>General Slide B</SwiperSlide>
//           <SwiperSlide>General Slide C</SwiperSlide>
//         </Swiper>
//         <div className="swiper-pagination"></div>
//       </div>
//       <hr />

//       {/* FAQ Section */}
//       <h2>FAQ Section</h2>
//       <div className="faq-section-wrapper">
//         {faqData.map((item, index) => (
//           <div
//             className={`faq-item ${activeFAQItem === index ? 'active' : ''}`}
//             key={index}
//           >
//             <div className="faq-question" onClick={() => toggleFAQ(index)}>
//               <h3>{item.question}</h3>
//             </div>
//             <div
//               className="faq-answer"
//               style={{ maxHeight: activeFAQItem === index ? 'unset' : '0px' }}
//             >
//               <p>{item.answer}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <hr />

//       {/* Shopping Cart */}
//       <h2>Shopping Cart</h2>
//       <div className="zelcashop-cart">
//         {cartItems.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           <>
//             {cartItems.map(item => (
//               <div className="zelcashop-cart-item" key={item.id} data-unit-price={item.unitPrice}>
//                 <div className="item-details">
//                   <span className="item-name">{item.name}</span>
//                   <div className="quantity-controls">
//                     <button className="zelcashop-decrease-qty" onClick={() => handleDecreaseCartQuantity(item.id)}>-</button>
//                     <span className="zelcashop-item-quantity">{item.quantity}</span>
//                     <button className="zelcashop-increase-qty" onClick={() => handleIncreaseCartQuantity(item.id)}>+</button>
//                   </div>
//                   <span className="zelcashop-item-total-price">
//                     {(item.quantity * item.unitPrice).toFixed(2)} ر.س
//                   </span>
//                   <button className="zelcashop-remove-item" onClick={() => handleRemoveCartItem(item.id)}>
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <div className="cart-summary">
//               <p>Subtotal: <span className="zelcashop-subtotal-price">{cartSubtotal.toFixed(2)} ر.س</span></p>
//               <p>Total: <span className="zelcashop-final-total-price">{cartFinalTotal.toFixed(2)} ر.س</span></p>
//             </div>
//           </>
//         )}
//       </div>
//       <hr />

//       {/* Horizontal Scroll Container */}
//       <h2>Horizontal Scroll</h2>
//       <div
//         className="scroll-container"
//         ref={horizontalScrollContainerRef}
//         onMouseDown={handleMouseDownHorizontalScroll}
//         onMouseLeave={handleMouseLeaveHorizontalScroll}
//         onMouseUp={handleMouseUpHorizontalScroll}
//         onMouseMove={handleMouseMoveHorizontalScroll}
//         style={{ overflowX: 'auto', whiteSpace: 'nowrap', cursor: 'grab', userSelect: 'none', padding: '10px', border: '1px solid #ccc' }}
//       >
//         <div style={{ display: 'inline-block', minWidth: '250px', height: '150px', background: '#e0f7fa', margin: '10px', verticalAlign: 'top', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Scrollable Item 1</div>
//         <div style={{ display: 'inline-block', minWidth: '250px', height: '150px', background: '#ffe0b2', margin: '10px', verticalAlign: 'top', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Scrollable Item 2</div>
//         <div style={{ display: 'inline-block', minWidth: '250px', height: '150px', background: '#c8e6c9', margin: '10px', verticalAlign: 'top', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Scrollable Item 3</div>
//         <div style={{ display: 'inline-block', minWidth: '250px', height: '150px', background: '#ffccbc', margin: '10px', verticalAlign: 'top', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Scrollable Item 4</div>
//         <div style={{ display: 'inline-block', minWidth: '250px', height: '150px', background: '#bbdefb', margin: '10px', verticalAlign: 'top', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Scrollable Item 5</div>
//       </div>
//       <hr />

//       {/* Placeholder for Scroll to Top visibility */}
//       <div style={{ height: '1000px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         Scroll down to see the "Scroll to Top" button appear!
//       </div>

//       {/* Scroll to Top Button */}
//       <div className={`up ${showScrollToTopButton ? 'show' : ''}`} onClick={scrollToTop}
//         style={{
//           position: 'fixed', bottom: '30px', right: '30px',
//           backgroundColor: '#007bff', color: 'white', padding: '10px 15px',
//           borderRadius: '50%', cursor: 'pointer', zIndex: '1000',
//           display: showScrollToTopButton ? 'block' : 'none' // Conditional display via style
//         }}
//       >
//         ↑
//       </div>
//     </div>
//   );
// }

// export default App;