import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {BookingService} from '../booking.service';
import {HotelsService} from '../hotels.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApiUrls} from '../api-urls';

@Component({
  selector: 'app-my-bookings-page',
  standalone: false,

  templateUrl: './my-bookings-page.component.html',
  styleUrl: './my-bookings-page.component.css'
})
export class MyBookingsPageComponent {
  hotelsList: any = null;
  hotelRouteId: any;
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
              private router: Router,
              private bookingService: BookingService,
              private hotelService: HotelsService,
              private spinner: NgxSpinnerService,) {}

  ngOnInit() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.bookingService.getMyBookingHotels(headers).subscribe(
      (response) => {
        console.log(response);

        this.hotelsList = response
          .filter((booking: any) => booking.status?.status !== "CANCELED")
          .map((booking: any) => ({
            ...booking,
            formattedCheckInDate: this.formatCheckInOut(booking.checkIn, 'date'),
            formattedCheckInTime: this.formatCheckInOut(booking.checkIn, 'time'),
            formattedCheckOutDate: this.formatCheckInOut(booking.checkOut, 'date'),
            formattedCheckOutTime: this.formatCheckInOut(booking.checkOut, 'time'),
            hotel: null,
            hotelGrade: "Loading..."
          }));

        this.hotelsList.forEach((booking: { hotelId: number; }, index: string | number) => {
          if (booking.hotelId) {
            this.hotelService.getHotelById(booking.hotelId).subscribe(
              (hotel) => {
                this.hotelsList[index].hotel = hotel;
                this.hotelRouteId = hotel.id;
                this.hotelsList[index].hotelGrade = this.getHotelGrade(hotel.avgRate);
              },
              (error) => {
                console.error(`Error fetching hotel ${booking.hotelId}:`, error);
              }
            );
          }
        });
      },
      (error) => {
        console.error("Error fetching bookings:", error);
      }
    );
  }

  deleteBooking(booking: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.bookingService.deleteUserBooking(booking.id, headers).subscribe(
      (response) => {
        console.log(response);
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          window.location.reload();
        }, 500);
      }
    )
  }

  getHotelGrade(avgRate: number): string {
    switch (true) {
      case avgRate === 0:
        return "No rating";
      case avgRate < 6:
        return "Value stay";
      case avgRate < 8 && avgRate >= 6:
        return "Good";
      case avgRate < 9 && avgRate >= 8:
        return "Very good";
      case avgRate <= 10 && avgRate >= 9:
        return "Excellent";
      default:
        return "No rating";
    }
  }

  formatCheckInOut(dateString: string, type: 'date' | 'time'): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    if (type === 'date') {
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    if (type === 'time') {
      return date.getHours() === 12 ? 'Until 12:00' : `${date.getHours().toString().padStart(2, '0')}:00 - 00:00`;
    }

    return '';
  }

  redirectToHotelPage() {
    this.router.navigate(['/hotel', this.hotelRouteId]);
  }
}
