import React, { useEffect } from 'react';
import "../css/SMSNotification.css";



const SMSNotification = ({ otp, onClose }) => {
  useEffect(() => {
    // Play ping sound
    const audio = new Audio('/sounds/message-ping(2).aac');
    audio.play().catch((err) => console.warn('Audio error:', err));

    // Auto close after 6s
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white shadow-xl border-l-4 border-blue-500 px-5 py-4 rounded-lg z-50 animate-slideIn w-[300px]">
      <div className="text-sm font-semibold">📩 New Message</div>
      <div className="text-sm text-gray-700 mt-1">Your OTP is <strong>{otp}</strong></div>
    </div>
  );
};

export default SMSNotification;

