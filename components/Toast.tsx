
import React, { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  type?: ToastType;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose, type = 'success' }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  const baseClasses = "fixed bottom-20 right-4 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-up";
  const typeClasses = {
      success: 'bg-teal-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
      </div>
    </div>
  );
};

export default Toast;