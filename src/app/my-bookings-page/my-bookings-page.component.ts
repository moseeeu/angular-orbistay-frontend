import { Component } from '@angular/core';
import {ApiUrls} from '../api-urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-bookings-page',
  standalone: false,

  templateUrl: './my-bookings-page.component.html',
  styleUrl: './my-bookings-page.component.css'
})
export class MyBookingsPageComponent {
  hotel = {
    id: 1,
    mainImageUrl: "https://orbistayblob.blob.core.windows.net/hotels/cozy-ny-hotel-main.svg",
    name: "The Manhattan Haven",
    shortDesc: "Cozy hotel in New York",
    avgRate: 7.25,
    stars: 4,
    reviewsCount: 20,
    fullDesc: "A cozy hotel in New York with modern amenities, a beautiful city view, and excellent service.",
    address: {
      id: 1,
      city: "New York",
      street: "123 Main St",
      country: {
        id: 1,
        code: "US",
        name: "United States",
      }
    },
    hotelRoom: {
      id: 3,
      name: "Suite",
      area: 13.87,
      capacity: 4,
      child_friendly: true,
      costPerNight: 40,
      description: "A spacious suite with a separate living area, premium amenities, and a beautiful city view. Includes free Wi-Fi.",
      images: [
        "https://orbistayblob.blob.core.windows.net/rooms/suite_room_1_1.jpg",
        "https://orbistayblob.blob.core.windows.net/rooms/suite_room_1_2.jpg"
      ],
      roomBedLinks: [
        {
          id: 2,
          bedType: "DOUBLE"
        }
      ]
    }
  };


  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private router: Router,) {}

  ngOnInit() {

  }

  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
