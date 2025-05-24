import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../shared/services/api.service';
import { Profile } from '../types/profile.type';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileDataSubject = new BehaviorSubject<Profile | null>(null);
  profileData$ = this.profileDataSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) { }


  myProfile() {
    this.api.get('http://localhost:3000/profile/my-profile').subscribe({
      next: (res: HttpResponse<any>) => {
        const data: Profile = res.body?.data.user;
        this.profileDataSubject.next(data);
      },
      error: (err) => {
        console.error('profile error:', err);
      }
    });
  }
  
}