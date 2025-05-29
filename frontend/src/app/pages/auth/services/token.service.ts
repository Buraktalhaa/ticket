import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DecodedToken } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private cookie: CookieService) {}

  setTokens(accessToken: string, refreshToken: string, role: string) {
    this.cookie.set('accessToken', accessToken, undefined, '/');
    this.cookie.set('refreshToken', refreshToken, undefined, '/');
    this.cookie.set('role', role, undefined, '/');
  }

  deleteTokens() {
    this.cookie.delete('accessToken', '/');
    this.cookie.delete('refreshToken', '/');
    this.cookie.delete('role', '/');
  }

  decodeJwt(token: string): DecodedToken {
    return jwtDecode(token);
  }

  hasValidTokens(): boolean {
    return this.cookie.check('accessToken') || this.cookie.check('refreshToken');
  }
}
