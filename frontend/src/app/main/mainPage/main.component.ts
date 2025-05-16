import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { AuthService } from '../../auth/shared/services/auth.service';

@Component({
  selector: 'app-main',
  imports: [NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private authService: AuthService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(!!localStorage.getItem("accessToken"));
    this.authService.isThereUser.set(!!localStorage.getItem("accessToken")) 
  }
}
