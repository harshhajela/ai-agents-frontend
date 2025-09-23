import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);

  getToasts() {
    return this.toasts.asReadonly();
  }

  showToast(message: string, type: Toast['type'] = 'info', duration: number = 4000) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };

    this.toasts.update(toasts => [...toasts, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      this.removeToast(id);
    }, duration);

    return id;
  }

  showError(message: string, duration: number = 4000) {
    return this.showToast(message, 'error', duration);
  }

  showSuccess(message: string, duration: number = 3000) {
    return this.showToast(message, 'success', duration);
  }

  showInfo(message: string, duration: number = 3000) {
    return this.showToast(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 3000) {
    return this.showToast(message, 'warning', duration);
  }

  removeToast(id: string) {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clearAll() {
    this.toasts.set([]);
  }
}