import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {ApiUrls} from './api-urls';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})

export class HotelsService {
  private hotelsSubject = new BehaviorSubject<any[]>([]);
  private roomsSubject = new BehaviorSubject<any[]>([]);
  private favouriteHotelsSubject = new BehaviorSubject<any[]>([]);
  favouriteHotels$ = this.favouriteHotelsSubject.asObservable();
  hotels$ = this.hotelsSubject.asObservable();
  rooms$ = this.roomsSubject.asObservable();
  private isHotelsLoaded = false;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.loadFavouriteHotels();
  }

  getHotelsByApi(hotelApiString: string): Observable<any> {
    if (this.isHotelsLoaded) {
      return this.hotels$;
    }
    return this.http.get<any>(hotelApiString).pipe(
      tap(hotels => this.setFilteredHotels(hotels))
    );
  }

  getFilteredHotels(apiUrl: string, requestBody: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let params = new HttpParams();
    Object.keys(requestBody).forEach((key) => {
      params = params.set(key, requestBody[key]);
    });

    return this.http.get(apiUrl, {
      headers,
      params,
    });
  }

  getFilteredRooms(apiUrl: string, params: HttpParams): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(apiUrl, {
      headers,
      params,
    });
  }

  getFavouritesHotels(): Observable<any[]> {
    return this.favouriteHotels$;
  }

  getRecentlyViewedHotels() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    return this.http.get<any>(ApiUrls.GET_RECENTLY_VIEWED_HOTELS, { headers, withCredentials: true });
  }

  setFilteredHotels(hotels: any[]) {
    this.hotelsSubject.next(hotels);
    this.isHotelsLoaded = true;
  }

  setFilteredRooms(rooms: any[]) {
    this.roomsSubject.next(rooms);
  }

  getHotelById(hotelId: number): Observable<any> {
    return this.http.get<any>(`${ApiUrls.GET_HOTEL_BY_ID_URL}/${hotelId}`);
  }

  createReview(requestBody: any, headers: any) {
    return this.http.post<any>(ApiUrls.POST_HOTEL_REVIEW_ROOMS, requestBody, headers);
  }

  addToFavourites(hotelId: number): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    this.http.post<any>(
      `${ApiUrls.POST_HOTEL_TO_FAVOURITES}/${hotelId}`,
      {},
      { headers, withCredentials: true }
    ).pipe(
      catchError(error => {
        console.error('Error adding to favourites', error);
        return throwError(() => new Error('Failed to add hotel to favourites'));
      })
    ).subscribe(
      (response) => {
        const currentFavourites = this.favouriteHotelsSubject.getValue();
        this.favouriteHotelsSubject.next([...currentFavourites, { id: hotelId }]);
      }
    );
  }

  removeFromFavourites(hotelId: number): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    this.http.delete<any>(
      `${ApiUrls.DELETE_HOTEL_TO_FAVOURITES}/${hotelId}`,
      { headers, withCredentials: true }
    ).subscribe(
      () => {
        const currentFavourites = this.favouriteHotelsSubject.getValue();
        this.favouriteHotelsSubject.next(currentFavourites.filter(hotel => hotel.id !== hotelId));
      },
      (error) => console.error('Error removing from favourites', error)
    );
  }
  private loadFavouriteHotels() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });
    this.http.get<any[]>(ApiUrls.GET_HOTEL_TO_FAVOURITES, { headers, withCredentials: true })
      .subscribe(
        (hotels) => this.favouriteHotelsSubject.next(hotels),
        (error) => console.error('Error loading favourite hotels', error)
      );
  }
  refreshFavouriteHotels() {
    this.loadFavouriteHotels();
  }
  refreshHotels(apiUrl: string) {
    this.http.get<any[]>(apiUrl).subscribe(hotels => this.hotelsSubject.next(hotels));
  }

  refreshRooms(apiUrl: string, params: HttpParams) {
    this.getFilteredRooms(apiUrl, params).subscribe(rooms => this.roomsSubject.next(rooms));
  }
}
