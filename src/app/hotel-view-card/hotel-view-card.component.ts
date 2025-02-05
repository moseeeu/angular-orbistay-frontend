import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-hotel-view-card',
  standalone: false,

  templateUrl: './hotel-view-card.component.html',
  styleUrl: './hotel-view-card.component.css'
})
export class HotelViewCardComponent {
  @Input() title: string = '';
  @Input() location: string = '';
  @Input() rating: number = 0;
  @Input() reviews: number = 0;
  @Input() image: string = '';
}
