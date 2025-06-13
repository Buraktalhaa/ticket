// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationAction {
  label: string;
  handler: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationData {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  autoClose?: boolean;
  showProgress?: boolean;
  persistent?: boolean; // Kullanıcı manuel kapatana kadar açık kalır
  action?: NotificationAction;
  icon?: string; // Custom icon class or SVG
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationData | null>(null);
  private notificationQueue: NotificationData[] = [];
  private isProcessing = false;
  
  notification$: Observable<NotificationData | null> = this.notificationSubject.asObservable();

  /**
   * Ana notification gösterme metodu
   */
  showNotification(data: NotificationData): void {
    if (data.persistent) {
      data.autoClose = false;
      data.showProgress = false;
    }

    this.notificationSubject.next(data);
  }

  /**
   * Başarı bildirimi göster
   */
  success(
    message: string, 
    title?: string, 
    options?: Partial<NotificationData>
  ): void {
    this.showNotification({
      type: 'success',
      message,
      title: title || 'Success',
      duration: 4000,
      showProgress: true,
      autoClose: true,
      ...options
    });
  }

  /**
   * Hata bildirimi göster
   */
  error(
    message: string, 
    title?: string, 
    options?: Partial<NotificationData>
  ): void {
    this.showNotification({
      type: 'error',
      message,
      title: title || 'Error',
      duration: 6000, 
      showProgress: true,
      autoClose: true,
      ...options
    });
  }

  /**
   * Uyarı bildirimi göster
   */
  warning(
    message: string, 
    title?: string, 
    options?: Partial<NotificationData>
  ): void {
    this.showNotification({
      type: 'warning',
      message,
      title: title || 'Warning',
      duration: 4000,
      showProgress: true,
      autoClose: true,
      ...options
    });
  }

  /**
   * Bilgi bildirimi göster
   */
  info(
    message: string, 
    title?: string, 
    options?: Partial<NotificationData>
  ): void {
    this.showNotification({
      type: 'info',
      message,
      title: title || 'Info',
      duration: 4000,
      showProgress: true,
      autoClose: true,
      ...options
    });
  }

  /**
   * Persist notification - Manuel kapatılana kadar açık kalır
   */
  persistent(
    type: NotificationType,
    message: string,
    title?: string,
    action?: NotificationAction
  ): void {
    this.showNotification({
      type,
      message,
      title,
      persistent: true,
      action,
      autoClose: false,
      showProgress: false
    });
  }

  /**
   * Action'lı notification
   */
  withAction(
    type: NotificationType,
    message: string,
    action: NotificationAction,
    title?: string,
    options?: Partial<NotificationData>
  ): void {
    this.showNotification({
      type,
      message,
      title,
      action,
      autoClose: false, // Action'lı notification'lar manuel kapatılır
      showProgress: false,
      ...options
    });
  }

  /**
   * Özel süre ile notification
   */
  timed(
    type: NotificationType,
    message: string,
    duration: number,
    title?: string,
    options?: Partial<NotificationData>
  ): void {
    this.showNotification({
      type,
      message,
      title,
      duration,
      showProgress: true,
      autoClose: true,
      ...options
    });
  }

  /**
   * Hızlı başarı mesajı (kısa süre)
   */
  quickSuccess(message: string): void {
    this.success(message, undefined, { 
      duration: 2000,
      title: '✓'
    });
  }

  /**
   * Hızlı hata mesajı (kısa süre)
   */
  quickError(message: string): void {
    this.error(message, undefined, { 
      duration: 3000,
      title: '✗'
    });
  }

  /**
   * Loading notification
   */
  loading(message: string = 'Yükleniyor...', title?: string): void {
    this.showNotification({
      type: 'info',
      message,
      title: title || 'Bekleyin',
      persistent: true,
      icon: 'loading', // Custom loading icon
      autoClose: false,
      showProgress: false
    });
  }

  /**
   * Confirmation notification with actions
   */
  confirm(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title: string = 'Onaylayın'
  ): void {
    this.showNotification({
      type: 'warning',
      title,
      message,
      autoClose: false,
      showProgress: false,
      action: {
        label: 'Onayla',
        handler: onConfirm,
        style: 'primary'
      }
    });
  }

  /**
   * Queue system için - Çoklu notification'ları sırayla göster
   */
  queue(notifications: NotificationData[]): void {
    this.notificationQueue.push(...notifications);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.notificationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      if (notification) {
        this.showNotification(notification);
        // Her notification arasında kısa bir bekleme
        await this.delay(500);
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Tüm notification'ları temizle
   */
  clearAll(): void {
    this.notificationSubject.next(null);
    this.notificationQueue = [];
  }

  /**
   * Deprecated - Geriye uyumluluk için
   */
  clearNotification(): void {
    this.clearAll();
  }

  /**
   * Utility methods for common scenarios
   */

  // API çağrıları için
  apiSuccess(message: string = 'İşlem başarıyla tamamlandı'): void {
    this.quickSuccess(message);
  }

  apiError(error: any): void {
    const message = error?.message || error?.error?.message || 'Bir hata oluştu';
    this.error(message, 'API Hatası', { duration: 6000 });
  }

  // Form işlemleri için
  formSuccess(message: string = 'Form başarıyla gönderildi'): void {
    this.success(message, 'Form Gönderildi');
  }

  formError(message: string = 'Form gönderilirken hata oluştu'): void {
    this.error(message, 'Form Hatası');
  }

  // Validation hatları için
  validationError(message: string): void {
    this.warning(message, 'Doğrulama Hatası', { duration: 4000 });
  }

  // Network durumu için
  networkError(): void {
    this.persistent(
      'error',
      'İnternet bağlantınızı kontrol edin',
      'Bağlantı Hatası'
    );
  }

  // Permission hatları için
  permissionError(): void {
    this.error(
      'Bu işlem için yetkiniz bulunmamaktadır',
      'Yetki Hatası',
      { duration: 5000 }
    );
  }
}