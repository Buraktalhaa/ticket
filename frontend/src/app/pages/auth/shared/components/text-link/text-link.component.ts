import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-text-link',
  imports: [RouterLink],
  templateUrl: './text-link.component.html',
  styleUrl: './text-link.component.css'
})
export class TextLinkComponent {
  @Input() text:string =''
  @Input() link:string =''
  @Input() buttonName:string =''
}