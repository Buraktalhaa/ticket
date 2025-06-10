// notification.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService, NotificationData } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

export interface ExtendedNotificationData extends NotificationData {
  id: string;
  timestamp: number;
  isClosing?: boolean;
  animationState?: 'in' | 'out';
  showProgress?: boolean;
  duration?: number;
  title?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideIn', [
      state('in', style({ 
        transform: 'translateX(0)', 
        opacity: 1 
      })),
      transition('void => in', [
        style({ 
          transform: 'translateX(100%)', 
          opacity: 0 
        }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('in => void', [
        animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ 
            transform: 'translateX(100%)', 
            opacity: 0 
          })
        )
      ])
    ])
  ]
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();
  
  notifications: ExtendedNotificationData[] = [];
  private timeouts = new Map<string, any>();
  private readonly MAX_NOTIFICATIONS = 5;

  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.addNotification(data);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearAllTimeouts();
  }

  private addNotification(data: NotificationData): void {
    const notification: ExtendedNotificationData = {
      ...data,
      id: this.generateId(),
      timestamp: Date.now(),
      animationState: 'in',
      showProgress: data.showProgress ?? true,
      duration: data.duration || this.getDefaultDuration(data.type)
    };

    if (this.notifications.length >= this.MAX_NOTIFICATIONS) {
      const oldestNotification = this.notifications[0];
      this.closeNotification(oldestNotification.id);
    }

    this.notifications.push(notification);

    // Otomatik kapanma
    if (data.autoClose !== false) {
      const timeoutId = setTimeout(() => {
        this.closeNotification(notification.id);
      }, notification.duration);
      
      this.timeouts.set(notification.id, timeoutId);
    }
  }

  closeNotification(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const notification = this.notifications.find(n => n.id === id);
    if (!notification || notification.isClosing) return;

    // Closing state'ini işaretle
    notification.isClosing = true;
    notification.animationState = 'out';

    // Timeout'u temizle
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }

    // Animasyon sonrası kaldır
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }, 200);
  }

  getDefaultTitle(type: string): string {
    const titles: Record<string, string> = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    return titles[type] || 'Bildirim';
  }

  private getDefaultDuration(type: string): number {
    const durations: Record<string, number> = {
      success: 4000,
      error: 6000,
      warning: 5000,
      info: 4000
    };
    return durations[type] || 4000;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private clearAllTimeouts(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}