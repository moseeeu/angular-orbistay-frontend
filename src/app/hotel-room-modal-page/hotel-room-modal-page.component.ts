import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-hotel-room-modal-page',
  standalone: false,

  templateUrl: './hotel-room-modal-page.component.html',
  styleUrl: './hotel-room-modal-page.component.css'
})
export class HotelRoomModalPageComponent {
  @Output() close = new EventEmitter<void>();
  @Input() room: any;
  currentImageIndex: number = 0;
  currentIndex: number = 0;
  reviewsPerPage: number = 3;

  room_facilities = [
    { name: 'Air Conditioning', icon: 'hotel-facilities/air-conditioning.svg' },
    { name: 'Antique Furniture', icon: 'hotel-facilities/antique-furniture.svg' },
    { name: 'City View', icon: 'hotel-facilities/beautiful-view.svg' },
    { name: 'Flat-Screen TV', icon: 'hotel-facilities/flatscreen-tv.svg' },
    { name: 'Free Parking', icon: 'hotel-facilities/free-parking.svg' },
    { name: 'Free WiFi', icon: 'hotel-facilities/free-wi-fi.svg' },
    { name: 'Hair Dryer', icon: 'hotel-facilities/hair-dryer.svg' },
    { name: 'Iron', icon: 'hotel-facilities/iron.svg' },
    { name: 'King-sized Bed', icon: 'hotel-facilities/king-sized-bed.svg' },
    { name: 'Mini Bar', icon: 'hotel-facilities/mini-bar.svg' },
    { name: 'Modern Amenities', icon: 'hotel-facilities/modern-amenities.svg' },
    { name: 'Balcony', icon: 'hotel-facilities/private-balcony.svg' },
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

  ngOnInit() {
    console.log("Room on modal page", this.room);
  }

  changeImage(room: any, direction: number) {
    const totalImages = room.images.length;
    this.currentImageIndex = (this.currentImageIndex + direction + totalImages) % totalImages;
  }

  checkFacility(roomFacilities: any[], facilityName: string): boolean {
    return roomFacilities.some(facility => facility.name === facilityName);
  }
  getRoomViews(): string[] {
    return this.room.roomFacilityLinks
      .filter((facility: { name: string; }) => facility.name.toLowerCase().includes('view'))
      .map((facility: { name: any; }) => facility.name);
  }



  closeModal() {
    this.close.emit();
  }
}
