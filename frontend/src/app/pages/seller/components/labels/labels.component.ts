import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-labels',
  imports: [],
  templateUrl: './labels.component.html',
  styleUrl: './labels.component.css'
})
export class LabelsComponent {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<any>();

  isFocused: boolean = false;

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.modelChange.emit(target.value);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
}
