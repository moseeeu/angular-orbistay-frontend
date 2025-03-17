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

  hotelGrade: any;

  ngOnInit() {
    switch (true) {
      case (this.hotel.avgRate === 0):
        this.hotelGrade = "No rating";
        break;
      case (this.hotel.avgRate < 6):
        this.hotelGrade = "Value stay";
        break;
      case (this.hotel.avgRate < 8 && this.hotel.avgRate >= 6):
        this.hotelGrade = "Good";
        break;
      case (this.hotel.avgRate < 9 && this.hotel.avgRate >= 8):
        this.hotelGrade = "Very good";
        break;
      case (this.hotel.avgRate <= 10 && this.hotel.avgRate >= 9):
        this.hotelGrade = "Excellent";
        break;
    }
  }

  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
