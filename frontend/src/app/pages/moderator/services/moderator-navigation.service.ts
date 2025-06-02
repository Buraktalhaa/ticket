import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModeratorNavigationService {
  constructor(private router: Router) {}

  goToModeratorStatusPanel() {
    this.router.navigateByUrl('moderator-dashboard/status-panel');
  }

  goToStatusEditPage(ticket: any) {
    this.router.navigate(['moderator-dashboard/status-panel/edit'], { state: { ticket } });
  }
}