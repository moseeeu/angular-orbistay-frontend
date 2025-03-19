import {Component, Input, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HotelsService} from '../hotels.service';

@Component({
  selector: 'app-horizontal-hotel-search-card',
  standalone: false,
  templateUrl: './horizontal-hotel-search-card.component.html',
  styleUrl: './horizontal-hotel-search-card.component.css'
})
export class HorizontalHotelSearchCardComponent implements OnInit {
  @Input() hotel!: any;

  hotelGrade: string = '';
  isInFavourite: boolean = false;

  constructor(
    public router: Router,
    private hotelsService: HotelsService
  ) {}

  ngOnInit() {
    // Подписка на список избранных отелей
    this.hotelsService.favouriteHotels$.subscribe((favourites) => {
      this.isInFavourite = favourites.some((favHotel) => favHotel.id === this.hotel.id);
    });

    this.setHotelGrade();
  }

  setHotelGrade() {
    if (this.hotel.avgRate === 0) this.hotelGrade = "No rating";
    else if (this.hotel.avgRate < 6) this.hotelGrade = "Value stay";
    else if (this.hotel.avgRate < 8) this.hotelGrade = "Good";
    else if (this.hotel.avgRate < 9) this.hotelGrade = "Very good";
    else this.hotelGrade = "Excellent";
  }

  addToFavourites() {
    if (!this.isInFavourite) {
      this.hotelsService.addToFavourites(this.hotel.id);
    } else {
      this.hotelsService.removeFromFavourites(this.hotel.id);
    }
  }

  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
