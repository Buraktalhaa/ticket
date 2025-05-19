import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // kullanici subscribe olabilsin diye
  private profileDataSubject = new BehaviorSubject(null);
  profileData$ = this.profileDataSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) { }


  myProfile() {
    this.api.get('http://localhost:3000/profile/myProfile').subscribe({
      next: (res: HttpResponse<any>) => {
        const data = res.body?.data || [];
        this.profileDataSubject.next(data);
        this.router.navigateByUrl('/my-profile');
      },
      error: (err) => {
        console.error('profile error:', err);
      }
    });

  }
}