import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiUrls {
  static readonly BASE_URL = '*****************************************************';
  //=================================USER API URLS=================================
  static readonly GET_USER_URL:string = `${ApiUrls.BASE_URL}/appUsers/me`;
  static readonly PUT_USER_URL:string = `${ApiUrls.BASE_URL}/appUsers/me`;
  static readonly POST_USER_AVATAR_URL:string = `${ApiUrls.BASE_URL}/appUsers/me/avatar`;

  //=================================AUTH API URLS=================================
  static readonly SIGN_IN_URL:string = `${ApiUrls.BASE_URL}/auth/signIn`;
  static readonly SIGN_UP_URL:string = `${ApiUrls.BASE_URL}/auth/signUp`;
  static readonly GET_OAUTH2_GOOGLE_URL:string = `${ApiUrls.BASE_URL}/oauth2/google/login`;

  //=================================HOTELS API URLS=================================
  static readonly GET_POPULAR_HOTELS_URL:string = `${ApiUrls.BASE_URL}/hotels/popular`;
  static readonly GET_FILTER_HOTELS_URL:string = `${ApiUrls.BASE_URL}/hotels/filter`;

  //=================================DESTINATIONS API URLS=================================
  static readonly GET_POPULAR_DESTINATIONS_URL:string = `${ApiUrls.BASE_URL}/destinations/popular`;
}
