import { Component } from '@angular/core';
import { ProfileService } from '../shared/services/profile.service';
import { Profile } from '../shared/types/profile.type';
import { NavbarComponent } from '../../main/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-my-profile',
  imports: [NavbarComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  birtday:string =''
  photoName:string =''
  lastName:string =''
  firstName:string =''
  email:string =''

  constructor(private profileService: ProfileService){}

  ngOnInit(): void {
    this.profileService.profileData$.subscribe((data:any) => { 
      if (data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.photoName = data.photoName;
        this.birtday = data.birtday;
      }
    });
    this.profileService.myProfile()
  }
}