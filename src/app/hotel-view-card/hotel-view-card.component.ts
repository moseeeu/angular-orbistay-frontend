import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-hotel-view-card',
  standalone: false,

  templateUrl: './hotel-view-card.component.html',
  styleUrl: './hotel-view-card.component.css'
})
export class HotelViewCardComponent {
  @Input() title: string = ''; // Заголовок карточки
  @Input() location: string = ''; // Локация
  @Input() rating: number = 0; // Рейтинг
  @Input() reviews: number = 0; // Количество отзывов
  @Input() image: string = '';
}
