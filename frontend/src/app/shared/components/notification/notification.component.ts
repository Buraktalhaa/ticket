import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NotificationData, NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notification: NotificationData | null = null;
  timeoutId: any;
  isFadingOut = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((data) => {
      if (data && data !== this.notification) {
        this.isFadingOut = false;
        this.notification = data;

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.close(), 3000);
      }
    });
  }

  close(): void {
    clearTimeout(this.timeoutId);
    this.isFadingOut = true;

    setTimeout(() => {
      this.notificationService.clearNotification();
      this.isFadingOut = false;
      this.notification = null;
    }, 600);
  }
}