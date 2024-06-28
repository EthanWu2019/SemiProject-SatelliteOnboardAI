import React, { useEffect } from 'react';

const customAlertStyles = {
  modal: {
    display: 'block',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    maxWidth: '300px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    textAlign: 'center',
    borderRadius: '10px',
  },
  alertButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    margin: '15px 0 0 0',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

const CustomAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3 seconds timer
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  return (
    <div style={customAlertStyles.modal}>
      <div style={customAlertStyles.modalContent}>
        <p>{message}</p>
        <button style={customAlertStyles.alertButton} onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;
