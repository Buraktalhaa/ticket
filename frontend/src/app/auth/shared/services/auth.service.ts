import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';
import { Email, Signin, Signup } from '../types/auth.type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  signIn(signinData: Signin) {
    this.api
      .post('http://localhost:3000/auth/signIn', signinData)
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        this.router.navigateByUrl("/main")
      });
  }

  signUp(signupData: Signup) {
    this.api
      .post('http://localhost:3000/auth/signUp', signupData)
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        const refreshToken = res.body.refreshToken
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        this.router.navigateByUrl("/signin")
      });
  }

  signInGoogle() {
    this.api
      .get('http://localhost:3000/auth/google')
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken;
        const refreshToken = res.body.refreshToken;
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)

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
}
