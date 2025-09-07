import { create } from 'zustand';

export const useToast = create((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  },
  
  // Convenience methods
  success: (message, options = {}) => {
    return get().addToast({ type: 'success', message, ...options });
  },
  
  error: (message, options = {}) => {
    return get().addToast({ type: 'error', message, ...options });
  },
  
  warning: (message, options = {}) => {
    return get().addToast({ type: 'warning', message, ...options });
  },
  
  info: (message, options = {}) => {
    return get().addToast({ type: 'info', message, ...options });
  }
}));
