// components/ui/use-toast.ts
import { toast as sonnerToast } from 'sonner';

// Import ToastOptions type from 'sonner' if available, otherwise use object
// import type { ToastOptions } from 'sonner';
type ToastOptions = object;

export function useToast() {
  const toast = (message: string, options?: ToastOptions) => {
    sonnerToast(message, { ...options });
  };

  const success = (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, { ...options });
  };

  const error = (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, { ...options });
  };

  const info = (message: string, options?: ToastOptions) => {
    sonnerToast(message, { ...options });
  };

  return { toast, success, error, info };
}
