import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private roomData: any;
  private hotelData: any;

  setRoomData(room: any, hotel: any) {
    this.roomData = room;
    this.hotelData = hotel;
  }

  getRoomData() {
    return { room: this.roomData, hotel: this.hotelData };
  }
}
