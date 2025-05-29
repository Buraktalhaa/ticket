import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-auth-input',
  imports: [CommonModule],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.css',
})
export class AuthInputComponent {
  public isFocused: boolean = false;

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() src: string = '';
  @Input() type: string = 'text';
  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<string>();

  constructor() {}

  // ngOnChanges(changes: SimpleChanges): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   console.log("6",changes);
  // }

  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.model = value;
    this.modelChange.emit(value);
  }
}
