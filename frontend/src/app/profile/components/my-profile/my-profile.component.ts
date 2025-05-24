import { Component } from '@angular/core';
import { Profile } from '../../types/profile.type';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  imports: [
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  user!: Profile;

  constructor(private profileService: ProfileService){}

  ngOnInit(): void {
    this.profileService.profileData$.subscribe(data => {
      if (data) {
        this.user = data;
      } else {
        this.profileService.myProfile();
      }
    });
  }
  
}