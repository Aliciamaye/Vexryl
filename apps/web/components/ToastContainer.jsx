import React from 'react';
import { useToast } from '../stores/ToastStore';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={0} // Duration handled by store
        />
      ))}
    </div>
  );
};

export default ToastContainer;
