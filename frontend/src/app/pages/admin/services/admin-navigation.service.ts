import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminNavigationService {

  constructor(private router: Router) {}

  goToAdminStatusPanel() {
    this.router.navigateByUrl('admin-dashboard/status-panel');
  }

  goToStatusEditPage(ticket: any) {
    this.router.navigate(['admin-dashboard/status-panel/edit'], { state: { ticket } });
  }
}
