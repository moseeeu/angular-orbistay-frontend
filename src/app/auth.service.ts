import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8180/auth';
  private getUserUrl = 'http://localhost:8180/app-user/get/current';
  private userSubject = new BehaviorSubject<any>(null)


  constructor(private http: HttpClient) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }

  registerUser(username: string, email: string, password: string): Observable<any> {
    const data = {
      username: username,
      email: email,
      password: password
    };
    return this.http.post<any>(`${this.apiUrl}/sign-up`, data);
  }

  loginUser(email: string, password: string): Observable<any> {
    const data = {
      email: email,
      password: password
    }
    return this.http.post<any>(`${this.apiUrl}/sign-in`, data);
  }
  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    console.log("Get user info token: ", token);
    const url = this.getUserUrl;

    return this.http.get('http://localhost:8180/app-user/get/current', { headers });
  }
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}

