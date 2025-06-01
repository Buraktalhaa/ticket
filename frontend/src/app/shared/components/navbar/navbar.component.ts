import { Component, ElementRef, HostListener, } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../../../pages/profile/services/profile.service';
import { AuthService } from '../../../pages/auth/services/auth.service';
import { AuthButtonsComponent } from '../auth-buttons/auth-buttons.component';

@Component({
  selector: 'app-navbar',
  imports: [
    AuthButtonsComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  role: string | null = null;
  isLoggedIn: boolean = false;
  isDropdownOpen: boolean = false;
  userPhotoUrl: string | null = null;

  constructor(
    private profileService: ProfileService,
    public authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.role = this.cookieService.get('role');
    this.isLoggedIn = this.cookieService.check('accessToken');
  
    this.profileService.profileData$.subscribe((user) => {
      this.userPhotoUrl = user?.photoName ?? null;
    });
  }

  getMyProfile() {
    this.router.navigateByUrl('/my-profile');
  }

  getAllTickets() {
    this.router.navigateByUrl('/main');
  }

  goToAdminDashboard() {
    this.router.navigateByUrl('/admin-dashboard');
  }

  goToSellerDashboard() {
    this.router.navigateByUrl('/seller-dashboard');
  }

  logOut() {
    this.authService.logOut()
  }

  selectCategory(category: string) {
    const allowedCategories = ['flight', 'train', 'bus', 'hotel', 'movie', 'theater', 'concert'];
    if (!allowedCategories.includes(category)) return;
    this.router.navigate(['/main', category]);
  }

  goToCart(){
    this.router.navigateByUrl('/my-profile/cart');
  }

  goToOrders(){
    this.router.navigateByUrl('/order/my-orders');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}