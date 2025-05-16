import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

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
    return this.api.get('http://localhost:3000/profile/myProfile');
  }

  setProfileData(data:any){
    this.profileDataSubject.next(data)
  }
}