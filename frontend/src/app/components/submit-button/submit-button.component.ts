import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-submit-button',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css',
})
export class SubmitButtonComponent {
  @Input() label: string = 'Submit';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() type: string = '';

  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    if (!this.isLoading && !this.disabled) {
      this.onClick.emit();
    }
  }
}
