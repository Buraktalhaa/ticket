import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-sign-button',
  imports: [],
  templateUrl: './sign-button.component.html',
  styleUrl: './sign-button.component.css'
})
export class SignButtonComponent {
  @Input() text:string = ''
}
