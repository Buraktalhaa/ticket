import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';
import { CookieKeys } from '../../../shared/types/token.types';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private cookie: CookieService) {}

  setTokens(accessToken: string, refreshToken: string, role: string) {
    this.cookie.set(CookieKeys.AccessToken, accessToken, undefined, '/');
    this.cookie.set(CookieKeys.RefreshToken, refreshToken, undefined, '/');
    this.cookie.set(CookieKeys.Role, role, undefined, '/');
  }

  deleteTokens() {
    this.cookie.delete(CookieKeys.AccessToken, '/');
    this.cookie.delete(CookieKeys.RefreshToken, '/');
    this.cookie.delete(CookieKeys.Role, '/');
  }

  decodeJwt(token: string): DecodedToken {
    return jwtDecode(token);
  }

  hasValidTokens(): boolean {
    return this.cookie.check(CookieKeys.AccessToken) || this.cookie.check(CookieKeys.RefreshToken);
  }

  handleTokensFromResponse(accessToken: string, refreshToken: string){
    this.deleteTokens()
    const role = this.decodeJwt(accessToken).role
    this.setTokens(accessToken, refreshToken, role);
  }
}