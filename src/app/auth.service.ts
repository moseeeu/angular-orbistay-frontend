import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from './api-urls';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null)

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }


  registerUser(username: string, email: string, password: string): Observable<any> {
    const data = {
      "username": username,
      "email": email,
      "password": password
    };
    return this.http.post<any>(`${ApiUrls.SIGN_UP_URL}`, data);
  }

  loginUser(email: string, password: string): Observable<any> {
    const data = {
      email: email,
      password: password
    }
    return this.http.post<any>(`${ApiUrls.SIGN_IN_URL}`, data);
  }

  loginUserByGoogle() {
    window.location.href = `${ApiUrls.GET_OAUTH2_GOOGLE_URL}`;
  }

  getUserInfo(): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    console.log("Get user info token: ", token);

    return this.http.get(`${ApiUrls.GET_USER_URL}`, { headers });
  }

  updateUserAvatar(avatar: any) {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    let formData: FormData = new FormData();
    formData.append('avatar', avatar);
    return this.http.post<any>(`${ApiUrls.POST_USER_AVATAR_URL}`, formData, {headers});
  }
  logOutUser() {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<any>(`${ApiUrls.LOG_OUT_URL}`, {
      "refreshToken": refreshToken}
    );
  }
}

