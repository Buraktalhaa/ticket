import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Profile } from '../types/profile.types';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileDataSubject = new BehaviorSubject<Profile | null>(null);
  profileData$ = this.profileDataSubject.asObservable();

  constructor(
    private api: ApiService,
    private notificationService: NotificationService
  ) { }

  myProfile() {
    this.api.get('http://localhost:3000/profile/my-profile').subscribe({
      next: (res: HttpResponse<any>) => {
        const data: Profile = res.body?.data.user;
        this.profileDataSubject.next(data);
      },
      error: (err:any) => {
        console.error('profile error:', err);
        this.notificationService.showNotification('error', 'Failed to load profile. Please try again.');
      }
    });
  }
  
  updateProfile(data: Partial<Profile>) {
    return this.api.put<Profile>('http://localhost:3000/profile/my-profile/edit', data);
  }
}