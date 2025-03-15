import { Injectable } from '@angular/core';
import {ApiUrls} from './api-urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from './token.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private roomData: any;
  private hotelData: any;

  constructor(private http : HttpClient,
              private tokenService: TokenService) {}

  setRoomData(room: any, hotel: any) {
    this.roomData = room;
    this.hotelData = hotel;
  }

  getMyBookingHotels(headers: any): Observable<any> {
    const httpOptions = {
      headers: headers,
      withCredentials: true
    };

    return this.http.get<any>(ApiUrls.GET_MY_BOOKINGS_URL, httpOptions);
  }

  deleteUserBooking(bookingId: any, headers: any) {
    const httpOptions = {
      headers: headers,
      withCredentials: true
    };

    return this.http.delete<any>(`${ApiUrls.DELETE_BOOKING_HOTEL_URL}/${bookingId}`, httpOptions);
  }
}
