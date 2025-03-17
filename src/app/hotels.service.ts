import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiUrls} from './api-urls';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private hotelsSubject = new BehaviorSubject<any[]>([]);
  private roomsSubject = new BehaviorSubject<any[]>([]);
  hotels$ = this.hotelsSubject.asObservable();
  rooms$ = this.roomsSubject.asObservable(); // Исправлено на roomsSubject

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getHotelsByApi(hotelApiString: string): Observable<any> {
    return this.http.get(hotelApiString);
  }

  getFilteredHotels(apiUrl: string, requestBody: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Преобразуем requestBody в HttpParams
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

  setFilteredHotels(hotels: any[]) {
    this.hotelsSubject.next(hotels);
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
}
