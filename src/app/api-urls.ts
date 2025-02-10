import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiUrls {
  static readonly BASE_URL = '*****************************************************';
  static readonly SIGN_IN_URL = `${ApiUrls.BASE_URL}/auth/signIn`;
  static readonly SIGN_UP_URL = `${ApiUrls.BASE_URL}/auth/signUp`;
  static readonly GET_USER_URL = `${ApiUrls.BASE_URL}/appUsers/me`;
  static readonly PUT_USER_URL = `${ApiUrls.BASE_URL}/appUsers/me`;
  static readonly GET_POPULAR_HOTELS_URL = `${ApiUrls.BASE_URL}/hotels/popular`;
  static readonly GET_FILTER_HOTELS_URL = `${ApiUrls.BASE_URL}/hotels/filter`;
  static readonly GET_POPULAR_DESTINATIONS_URL = `${ApiUrls.BASE_URL}/destinations/popular`;
  static readonly GET_OAUTH2_GOOGLE_URL = `${ApiUrls.BASE_URL}/oauth2/google/login`;
}
