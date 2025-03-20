import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HotelsService} from '../hotels.service';
import {ApiUrls} from '../api-urls';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hotel-view-card',
  standalone: false,

  templateUrl: './hotel-view-card.component.html',
  styleUrl: './hotel-view-card.component.css'
})
export class HotelViewCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() location: string = '';
  @Input() rating: number = 0;
  @Input() reviews: number = 0;
  @Input() image: string = '';
  @Input() hotelId: string = '';
  @Input() hotel: any;

  isInFavourite: boolean = false;
  hotelGrade: string = '';

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.hotelsService.favouriteHotels$.subscribe((favourites) => {
      this.isInFavourite = favourites.some((hotel) => hotel.id === +this.hotelId);
    });

    this.setHotelGrade();
  }

  setHotelGrade() {
    if (this.rating === 0) this.hotelGrade = "No rating";
    else if (this.rating < 6) this.hotelGrade = "Value stay";
    else if (this.rating < 8) this.hotelGrade = "Good";
    else if (this.rating < 9) this.hotelGrade = "Very good";
    else this.hotelGrade = "Excellent";
  }

  addToFavourites() {
    if (!this.isInFavourite) {
      this.hotelsService.addToFavourites(+this.hotelId);
    } else {
      this.hotelsService.removeFromFavourites(+this.hotelId);
    }
  }
  redirectToHotelPage() {
    this.router.navigate(['/hotel', this.hotelId]);
  }

}
