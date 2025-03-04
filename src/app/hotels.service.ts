import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiUrls} from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private hotelsSubject = new BehaviorSubject<any[]>([]);
  hotels$ = this.hotelsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getHotelsByApi(hotelApiString: string): Observable<any> {
    return this.http.get(hotelApiString);
  }
  getFilteredHotels(apiUrl: string, requestBody: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(apiUrl, {
      headers,
      params: requestBody
    });
  }
  setFilteredHotels(hotels: any[]) {
    this.hotelsSubject.next(hotels);
  }
}
