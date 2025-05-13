import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api.service';
import { Signin, Signup } from '../types/auth.type';
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
        localStorage.setItem("token", accessToken)
        console.log(res);
        this.router.navigateByUrl("/main")
      });
  }

  signUp(signupData: Signup) {
    this.api
      .post('http://localhost:3000/auth/signup', signupData)
      .subscribe((res: HttpResponse<any>) => {
        const accessToken = res.body.accessToken
        localStorage.setItem("token", accessToken)
        console.log(res);
        this.router.navigateByUrl("/signin")
      });
  }
}
// TODO: signup adini signUp yap