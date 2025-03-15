import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiUrls {
  static readonly BASE_URL = 'https://orbistay-backend-czfkfnfwhnheaaa3.northeurope-01.azurewebsites.net';
  //=================================USER API URLS=================================
  static readonly GET_USER_URL:string = `${ApiUrls.BASE_URL}/appUsers/me`;
  static readonly PUT_USER_URL:string = `${ApiUrls.BASE_URL}/appUsers/me`;
  static readonly POST_USER_AVATAR_URL:string = `${ApiUrls.BASE_URL}/appUsers/me/avatar`;
  static readonly POST_USER_BANK_CARD_URL:string = `${ApiUrls.BASE_URL}/appUsers/me/bankCards`;
  static readonly DELETE_USER_BANK_CARD_URL:string = `${ApiUrls.BASE_URL}/appUsers/me/bankCards`;

  //=================================AUTH API URLS=================================
  static readonly SIGN_IN_URL:string = `${ApiUrls.BASE_URL}/auth/signIn`;
  static readonly SIGN_UP_URL:string = `${ApiUrls.BASE_URL}/auth/signUp`;
  static readonly LOG_OUT_URL:string = `${ApiUrls.BASE_URL}/auth/logOut`;
  static readonly POST_UPDATE_ACCESS_TOKEN:string = `${ApiUrls.BASE_URL}/auth/refreshAccessToken`;
  static readonly GET_OAUTH2_GOOGLE_URL:string = `${ApiUrls.BASE_URL}/oauth2/google/login`;

  //=================================HOTELS API URLS=================================
  static readonly GET_POPULAR_HOTELS_URL:string = `${ApiUrls.BASE_URL}/hotels/popular`;
  static readonly GET_FILTER_HOTELS_URL:string = `${ApiUrls.BASE_URL}/hotels/filter`;
  static readonly GET_HOTEL_BY_ID_URL:string = `${ApiUrls.BASE_URL}/hotels`;
  static readonly GET_HOTEL_ROOMS:string = `${ApiUrls.BASE_URL}/hotels/rooms`;
  static readonly GET_FILTERED_HOTEL_ROOMS:string = `${ApiUrls.BASE_URL}/hotels/rooms/filter`;
  static readonly POST_HOTEL_TO_FAVOURITES:string = `${ApiUrls.BASE_URL}/favorites`;
  static readonly DELETE_HOTEL_TO_FAVOURITES:string = `${ApiUrls.BASE_URL}/favorites`;
  static readonly GET_HOTEL_TO_FAVOURITES:string = `${ApiUrls.BASE_URL}/favorites/me`;

  //=================================DESTINATIONS API URLS=================================
  static readonly GET_POPULAR_DESTINATIONS_URL:string = `${ApiUrls.BASE_URL}/destinations/popular`;
  static readonly GET_SIMILAR_DESTINATIONS_URL:string = `${ApiUrls.BASE_URL}/destinations/similar`;
  static readonly GET_ALL_COUNTRIES_URL:string = `${ApiUrls.BASE_URL}/countries`;

  //=================================RECENTLY VIEWED HOTELS API URLS=================================
  static readonly POST_RECENTLY_VIEWED_HOTEL:string = `${ApiUrls.BASE_URL}/recentlyViewedHotels/me`;
  static readonly GET_RECENTLY_VIEWED_HOTELS:string = `${ApiUrls.BASE_URL}/recentlyViewedHotels/me`;
}
