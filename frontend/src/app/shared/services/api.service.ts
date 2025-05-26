import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  get(url: string) {
    return this.httpClient.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('accessToken'),
      },
      observe: 'response',
    });
  }

  post<T>(url: string, data: T) {
    return this.httpClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('accessToken'),
      },
      observe: 'response',
    });
  }

  put<T>(url: string, data: Partial<T>) {
    return this.httpClient.put<T>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('accessToken'),
      },
      observe: 'response',
    });
  }
  

  patch<T>(url: string, data: T) {
    return this.httpClient.patch(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('accessToken'),
      },
      observe: 'response',
    });
  }

  delete(url: string) {
    return this.httpClient.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.cookieService.get('accessToken'),
      },
      observe: 'response',
    });
  }
}
