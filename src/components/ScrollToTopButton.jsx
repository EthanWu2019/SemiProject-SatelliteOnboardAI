import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
      {isVisible && (
        <div onClick={scrollToTop} className="scroll-to-top-button">
          <FaArrowUp />
        </div>
      )}
    </div>
  );
};

const styles = `
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s, visibility 0.4s;
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
}

.scroll-to-top-button {
  background: linear-gradient(45deg, #ff6f91, #ff9671, #ffc75f, #f9f871);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px #ffc75f, 0 0 20px #ff9671, 0 0 30px #ff6f91;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  background-size: 200% 200%;
  animation: gradient-animation 3s ease infinite;
}

@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.scroll-to-top-button:hover {
  transform: scale(1.2);
  background: linear-gradient(45deg, #00c6ff, #0072ff, #00c6ff, #0072ff);
  background-size: 200% 200%;
  animation: hover-gradient-animation 3s ease infinite;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 15px #00c6ff, 0 0 25px #0072ff, 0 0 35px #00c6ff;
}

@keyframes hover-gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

export default ScrollToTopButton;

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
