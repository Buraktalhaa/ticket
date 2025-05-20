import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input() public options: any[] = [];
  @Input() public defaultLabel: string = '';
  @Input() public selected: boolean = false;
  @Input() public removeDefaultOption: boolean = false;
  @Input() public disabled: boolean = false;

  @Output() public change = new EventEmitter<HTMLSelectElement>();

  onChange(event: Event): void {
    const selectEvent = event.target as HTMLSelectElement;
    this.change.emit(selectEvent);
  }
}
