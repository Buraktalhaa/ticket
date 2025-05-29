import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Profile } from '../types/profile.types';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileDataSubject = new BehaviorSubject<Profile | null>(null);
  profileData$ = this.profileDataSubject.asObservable();

  constructor(
    private api: ApiService,
  ) { }


  myProfile() {
    this.api.get('http://localhost:3000/profile/my-profile').subscribe({
      next: (res: HttpResponse<any>) => {
        const data: Profile = res.body?.data.user;
        this.profileDataSubject.next(data);
      },
      error: (err:any) => {
        console.error('profile error:', err);
      }
    });
  }
  
  updateProfile(data: Partial<Profile>) {
    return this.api.put<Profile>('http://localhost:3000/profile/my-profile/edit', data);
  }
}