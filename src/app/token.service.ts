import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUrls} from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) {}

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return <string>localStorage.getItem('token');
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post(`${ApiUrls.POST_UPDATE_ACCESS_TOKEN}`, {withCredentials: true});
  }
}
