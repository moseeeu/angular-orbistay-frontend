import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUrls} from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  constructor(private http: HttpClient) {}

  getHotelsByApi(hotelApiString: string): Observable<any> {
    return this.http.get(hotelApiString);
  }
  getFilteredHotelsByApi(apiUrl: string, requestBody: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Request-Body': JSON.stringify(requestBody)
    });

    return this.http.get(apiUrl, { headers });
  }
}
