import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {HotelsService} from '../hotels.service';

@Component({
  selector: 'app-favourite-hotels-page',
  standalone: false,

  templateUrl: './favourite-hotels-page.component.html',
  styleUrl: './favourite-hotels-page.component.css'
})
export class FavouriteHotelsPageComponent {
  favouriteHotelsList: any[] = [];

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private router: Router,
              private hotelService: HotelsService) {}

  ngOnInit(): void {
    this.hotelService.refreshFavouriteHotels();
    this.hotelService.favouriteHotels$.subscribe(
      (hotels) => {
        this.favouriteHotelsList = hotels;
      }
    );
  }
  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
