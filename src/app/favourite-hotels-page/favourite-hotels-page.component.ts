import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-favourite-hotels-page',
  standalone: false,

  templateUrl: './favourite-hotels-page.component.html',
  styleUrl: './favourite-hotels-page.component.css'
})
export class FavouriteHotelsPageComponent {
  favouriteHotelsList: any;

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private router: Router,) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.http.get<any>(ApiUrls.GET_HOTEL_TO_FAVOURITES, { headers, withCredentials: true }).subscribe(
      (response) => {
        this.favouriteHotelsList = response;
      }
    )

  }
  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
