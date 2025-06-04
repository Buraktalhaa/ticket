import { Injectable, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { SignIn, SignUp } from '../types/auth.types';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../shared/helpers/environment';

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

  signIn(signinData: SignIn): Observable<HttpResponse<any>> {
    return this.api.post(`${environment.apiUrl}/auth/sign-in`, signinData);
  }
  
  signUp(signupData: SignUp) {
    return this.api.post(`${environment.apiUrl}/auth/sign-up`, signupData)
  }

  signInGoogle() {
    return this.api.get(`${environment.apiUrl}/auth/google`)
  }

  logOut() {
    this.tokenService.deleteTokens();
    this.isThereUser.set(false);
    this.router.navigateByUrl('/sign-in');
  }
}