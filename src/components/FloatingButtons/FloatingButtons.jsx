import React, { useEffect, useRef } from 'react';
import '../../assets/css/style.css';
import arrowImg from '../../assets/images/arrow.png';
import whatsappImg from '../../assets/images/whatsapp.png';

const FloatingButtons = () => {
  const upButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 300) {
        upButtonRef.current?.classList.add("show");
      } else {
        upButtonRef.current?.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="up" ref={upButtonRef} onClick={scrollToTop}>
        <img src={arrowImg} alt="Scroll to top" />
      </div>

      <a href="https://wa.me/201015762659" className="whatsapp" target="_blank" rel="noopener noreferrer">
        <img loading="lazy" src={whatsappImg} alt="WhatsApp" />
      </a>

      <a href="tel:01015762659" className="phone" target="_blank" rel="noopener noreferrer">
        <i className="fas fa-phone fa-shake phone-i"></i>
      </a>
    </>
  );
};

export default FloatingButtons;
