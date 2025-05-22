import { Injectable, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';
import { DecodedToken, Email, Passwords, SignIn, SignUp } from '../types/auth.type';
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
  
  signIn(signinData: SignIn) {
    this.api
      .post('http://localhost:3000/auth/sign-in', signinData)
      .subscribe((res: HttpResponse<any>) => {
        this.deleteCookies()
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken
        
        this.cookieService.set('accessToken', accessToken, undefined, '/');
        this.cookieService.set('refreshToken', refreshToken, undefined, '/');
        
        const decoded = this.decodeJwt(accessToken);
        const role = decoded?.role;
        console.log(decoded);
        
        this.cookieService.set('role', role, undefined, '/');

        this.isThereUser.set(true)
        this.router.navigateByUrl("/main")
      });
  }

  signUp(signupData: SignUp) {
    this.api
      .post('http://localhost:3000/auth/sign-up', signupData)
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken

        this.cookieService.set('accessToken', accessToken, undefined, '/');
        this.cookieService.set('refreshToken', refreshToken, undefined, '/');        

        const decoded = this.decodeJwt(accessToken);
        const role = decoded?.role;
        this.cookieService.set('role', role, undefined, '/');

        this.isThereUser.set(true)
        this.router.navigateByUrl("/sign-in")
      });
  }

  signInGoogle() {
    this.api
      .get('http://localhost:3000/auth/google')
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken

        this.cookieService.set('accessToken', accessToken, undefined, '/');
        this.cookieService.set('refreshToken', refreshToken, undefined, '/');
        
        const decoded = this.decodeJwt(accessToken);
        
        const role = decoded?.role;
        this.cookieService.set('role', role, undefined, '/');

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

  decodeJwt(token: string): DecodedToken {
      return jwtDecode(token);
  }

  logOut() {
    this.deleteCookies()
  
    this.isThereUser.set(false);
    this.router.navigateByUrl('/sign-in');
  }

  deleteCookies(){
    this.cookieService.delete('accessToken', '/');
    this.cookieService.delete('refreshToken', '/');
    this.cookieService.delete('role', '/');
  
    this.cookieService.delete('accessToken'); // fallback
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('role');
  }
}