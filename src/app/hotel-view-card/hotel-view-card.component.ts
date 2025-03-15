import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-hotel-view-card',
  standalone: false,

  templateUrl: './hotel-view-card.component.html',
  styleUrl: './hotel-view-card.component.css'
})
export class HotelViewCardComponent {
  @Input() title: string = '';
  @Input() location: string = '';
  @Input() rating: number = 0;
  @Input() reviews: number = 0;
  @Input() image: string = '';

  hotelGrade: any;

  ngOnInit() {
    switch (true) {
      case (this.rating === 0):
        this.hotelGrade = "No rating";
        break;
      case (this.rating < 6):
        this.hotelGrade = "Value stay";
        break;
      case (this.rating < 8 && this.rating >= 6):
        this.hotelGrade = "Good";
        break;
      case (this.rating < 9 && this.rating >= 8):
        this.hotelGrade = "Very good";
        break;
      case (this.rating <= 10 && this.rating >= 9):
        this.hotelGrade = "Excellent";
        break;
    }
  }
}
