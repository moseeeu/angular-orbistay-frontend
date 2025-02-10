import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-horizontal-hotel-search-card',
  standalone: false,

  templateUrl: './horizontal-hotel-search-card.component.html',
  styleUrl: './horizontal-hotel-search-card.component.css'
})
export class HorizontalHotelSearchCardComponent {
  @Input() avgRate: string = '';
  @Input() name: string = '';
  @Input() stars: number = 0;
  @Input() reviews: number = 0;
  @Input() description: string = '';
  @Input() shortDescription: string = '';
}
