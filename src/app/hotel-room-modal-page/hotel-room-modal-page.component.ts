import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-hotel-room-modal-page',
  standalone: false,

  templateUrl: './hotel-room-modal-page.component.html',
  styleUrl: './hotel-room-modal-page.component.css'
})
export class HotelRoomModalPageComponent {
  @Output() close = new EventEmitter<void>();

  room_facilities = [
    { name: 'Air Conditioning', icon: 'hotel-facilities/air-conditioning.svg' },
    { name: 'Antique Furniture', icon: 'hotel-facilities/antique-furniture.svg' },
    { name: 'Beautiful View', icon: 'hotel-facilities/beautiful-view.svg' },
    { name: 'Flatscreen TV', icon: 'hotel-facilities/flatscreen-tv.svg' },
    { name: 'Free Parking', icon: 'hotel-facilities/free-parking.svg' },
    { name: 'Free Wi-Fi', icon: 'hotel-facilities/free-wi-fi.svg' },
    { name: 'Hair Dryer', icon: 'hotel-facilities/hair-dryer.svg' },
    { name: 'Iron', icon: 'hotel-facilities/iron.svg' },
    { name: 'King-sized Bed', icon: 'hotel-facilities/king-sized-bed.svg' },
    { name: 'Mini Bar', icon: 'hotel-facilities/mini-bar.svg' },
    { name: 'Modern Amenities', icon: 'hotel-facilities/modern-amenities.svg' },
    { name: 'Private Balcony', icon: 'hotel-facilities/private-balcony.svg' },
    { name: 'Single Bed', icon: 'hotel-facilities/single-bed.svg' },
    { name: 'Telephone', icon: 'hotel-facilities/telephone.svg' },
    { name: 'Work Desk', icon: 'hotel-facilities/work-desk.svg' },
  ];

  room_private_bath = [
    "Towels",
    "Toilet paper",
    "Toilet",
    "Hair dryer",
  ]

  room_view = [
    "Forest view"
  ]

  room_amenities = [
    "Mini bar",
    "Heating",
    "Cable channels",
    "Free Wi-Fi",
    "Slippers",
    "Wardrobe",
  ]

  closeModal() {
    this.close.emit();
  }
}
