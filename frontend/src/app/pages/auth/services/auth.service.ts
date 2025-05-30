import { Injectable, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { SignIn, SignUp } from '../types/auth.types';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {  
  public isThereUser = signal(false);

  constructor(
    private api: ApiService,
    private router: Router,
    private tokenService: TokenService

  ) {
    const hasTokens = this.tokenService.hasValidTokens();
    this.isThereUser.set(hasTokens);
  }
  
  signIn(signinData: SignIn): Observable<any> {
    return this.api
      .post('http://localhost:3000/auth/sign-in', signinData).pipe(
        tap((res: HttpResponse<any>) => {
          this.tokenService.deleteTokens();
  
          const accessToken = res.body.accessToken;
          const refreshToken = res.body.refreshToken;
  
          const role = this.tokenService.decodeJwt(accessToken)?.role;
          this.tokenService.setTokens(accessToken, refreshToken, role);
  
          this.isThereUser.set(true);
        })
      );
  }
  
  signUp(signupData: SignUp) {
    this.api
      .post('http://localhost:3000/auth/sign-up', signupData)
      .subscribe((res: HttpResponse<any>) => {
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

        const role = this.tokenService.decodeJwt(accessToken)?.role;

        this.tokenService.setTokens(accessToken, refreshToken, role);
        this.isThereUser.set(true);
        this.isThereUser.set(true)
        setTimeout(() => {
          this.router.navigateByUrl('/main');
        }, 3000);
      });
  }

  logOut() {
    this.tokenService.deleteTokens();
    this.isThereUser.set(false);
    this.router.navigateByUrl('/sign-in');
  }
}