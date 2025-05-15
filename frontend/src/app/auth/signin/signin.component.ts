import { Component, SimpleChanges } from '@angular/core';
import { AuthInputComponent } from '../shared/components/auth-input/auth-input.component';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TextLinkComponent } from '../shared/components/text-link/text-link.component';
import { FooterInfoTextComponent } from '../shared/components/footer-info-text/footer-info-text.component';
import { SignButtonComponent } from '../shared/components/sign-button/sign-button.component';
@Component({
  selector: 'app-signin',
  imports: [
    AuthInputComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    TextLinkComponent,
    FooterInfoTextComponent,
    SignButtonComponent
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { 
    console.log("2");
    
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log("3")
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log("4");
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log("5");
  }
 

  signIn() {
    if (!this.email || !this.password) {
      console.log("Missing information");
      return;
    }
    console.log("Degerler", this.email, this.password)

    const signInData = {
      email: this.email,
      password: this.password,
    };

    this.authService.signIn(signInData)
  }
}