import {Component, Input} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-horizontal-hotel-search-card',
  standalone: false,

  templateUrl: './horizontal-hotel-search-card.component.html',
  styleUrl: './horizontal-hotel-search-card.component.css'
})
export class HorizontalHotelSearchCardComponent {
  @Input() hotel!: any;

  constructor(public router: Router) {}

  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
