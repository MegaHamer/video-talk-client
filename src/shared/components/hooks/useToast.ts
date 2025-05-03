'use client';

import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'custom';

export function useToast() {
  const showToast = (
    message: string,
    type: ToastType = 'success',
    options?: any
  ) => {
    switch (type) {
      case 'success':
        return toast.success(message, options);
      case 'error':
        return toast.error(message, options);
      case 'loading':
        return toast.loading(message, options);
      default:
        return toast(message, options);
    }
  };

  const dismissToast = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return { showToast, dismissToast };
}