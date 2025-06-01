import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../shared/services/notification.service';

export function handlePaymentRedirect(response: any, notificationService: NotificationService) {
  const paymentLink = response.body?.paymentLink;
  if (paymentLink && paymentLink.startsWith('http')) {
    window.location.href = paymentLink;
  } else {
    notificationService.showNotification('error', 'Payment link could not be generated.');
  }
}

export function handleOrderError(error: HttpErrorResponse, notificationService: NotificationService) {
  const message = error?.error?.message || 'An error occurred while creating an order.';
  notificationService.showNotification('error', message);
}