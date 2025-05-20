import { Injectable, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';
import { Email, Passwords, Signin, Signup } from '../types/auth.type';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from "jwt-decode";



@Injectable({
  providedIn: 'root',
})
export class AuthService {  
  public isThereUser = signal(false);

  constructor(
    private api: ApiService,
    private router: Router,
    private cookieService: CookieService
  ) {
    const hasTokens =
      this.cookieService.check('accessToken') || this.cookieService.check('refreshToken');
    this.isThereUser.set(hasTokens);
  }
  
  signIn(signinData: Signin) {
    this.api
      .post('http://localhost:3000/auth/signIn', signinData)
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken
        
        this.cookieService.set('accessToken', accessToken);
        this.cookieService.set('refreshToken', refreshToken);
        console.log(accessToken);
        
        const decoded = this.decodeJwt(accessToken);
        const role = decoded?.role;
        console.log(role);
        
        this.cookieService.set('role', role);
        

        this.isThereUser.set(true)
        this.router.navigateByUrl("/main")
      });
  }

  signUp(signupData: Signup) {
    this.api
      .post('http://localhost:3000/auth/signUp', signupData)
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken

        this.cookieService.set('accessToken', accessToken);
        this.cookieService.set('refreshToken', refreshToken);

        const decoded = this.decodeJwt(accessToken);
        const role = decoded?.role;
        this.cookieService.set('role', role);

        this.isThereUser.set(true)
        this.router.navigateByUrl("/signin")
      });
  }

  signInGoogle() {
    this.api
      .get('http://localhost:3000/auth/google')
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken

        this.cookieService.set('accessToken', accessToken);
        this.cookieService.set('refreshToken', refreshToken);

        const decoded = this.decodeJwt(accessToken);
        const role = decoded?.role;
        this.cookieService.set('role', role);

        this.isThereUser.set(true)
        setTimeout(() => {
          this.router.navigateByUrl('/main');
        }, 3000);
      });
  }

  sendMail(email: Email) {
    this.api.post('http://localhost:3000/auth/forgot-password', email).subscribe({
      next: (res: HttpResponse<any>) => {
        this.router.navigateByUrl('/mail-sent');
      },
      error: (error: any) => {
        console.log("Error message:", error.error?.message);
      }
    });
  }

  sendNewPassword(newPassword: Passwords) {
    this.api.post(`http://localhost:3000/auth/reset-password/${newPassword.token}`, { password: newPassword.password, confirmPassword: newPassword.confirmPassword })
      .subscribe({
        next: (res: HttpResponse<any>) => {
          this.router.navigateByUrl('/mail-sent');
        },
        error: (error: any) => {
          console.log("Error message:", error.error?.message);
        }
      });
  }

  decodeJwt(token: string): any {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Invalid JWT', e);
      return null;
    }
  }

  logOut(){
    this.cookieService.deleteAll();
    this.router.navigateByUrl('/signin');
  }
}
