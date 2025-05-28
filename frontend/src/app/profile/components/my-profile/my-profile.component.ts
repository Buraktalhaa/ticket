import { Component } from '@angular/core';
import { Profile } from '../../types/profile.type';
import { NavbarComponent } from '../../../main/shared/components/navbar/navbar.component';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-my-profile',
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  user!: Profile;
  editMode = false;
  profileForm!: FormGroup;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.profileService.profileData$.subscribe(data => {
      if (data) {
        this.user = data;
      } else {
        this.profileService.myProfile();
      }
    });
  }
  initForm() {
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      email: [this.user.email],
      birthday: [this.user.birthday ? new Date(this.user.birthday) : null],
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.initForm();
    }
  }

  saveProfile() {
    if (!this.profileForm.valid) {
      this.notificationService.showNotification("error", "Form is not valid.");
      return;
    }

    const updatedData = this.profileForm.value;
    this.profileService.updateProfile(updatedData).subscribe({
      next: (response) => {
        this.notificationService.showNotification("success", "Profile updated succesfully.");
        const updatedUser = response.body;
        if (updatedUser) {
          this.user = updatedUser;
          this.editMode = false;
        }
      },
      error: () => {
        this.notificationService.showNotification("error", "Profile update failed.");
      }
    });
  }

}