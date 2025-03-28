import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from './api-urls';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null)
  appUser: any;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  currentUser: any = null;

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
    return this.http.post<any>(`${ApiUrls.SIGN_UP_URL}`, data, {withCredentials: true});
  }

  loginUser(email: string, password: string): Observable<any> {
    const data = {
      email: email,
      password: password
    }

    return this.http.post<any>(`${ApiUrls.SIGN_IN_URL}`, data, {withCredentials: true});
  }

  loginUserByGoogle() {
    window.location.href = `${ApiUrls.GET_OAUTH2_GOOGLE_URL}`;
  }

  getUserInfo(): Observable<any> {
    const token = this.tokenService.getToken();
    console.log(token);
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

  updateUserInfo(userData: any): Subscription {
    const token: string = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(ApiUrls.PUT_USER_URL, userData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Data uploaded successfully:', response);

          localStorage.removeItem('userData');
          localStorage.removeItem('token');

          localStorage.setItem('userData', JSON.stringify(response.appUser));
          localStorage.setItem('token', response.accessTokenResponseDTO.accessToken);

          const user = JSON.parse(localStorage.getItem('userData') || '{}');
          console.log('User:', user);

          this.updateUserData(user);
          window.location.reload();
        },
        error: (error: any) => {
          if (error.error?.message?.includes("duplicate key value violates unique constraint") &&
            error.error?.message?.includes("app_user_email_key")) {
            alert("This email is already in use. Please enter a different email.");
          } else {
            console.log(error);
            alert("An unexpected error occurred. Please try again later.");
          }
        }
      });
  }

  updateUserData(userData: any) {
    this.currentUser = userData;
    this.currentUserSubject.next(this.currentUser);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  resetPassword() {

  }

  resetPasswordRequest() {

  }

  deleteBankCard(bankCardId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    return this.http.delete<any>(`${ApiUrls.DELETE_USER_BANK_CARD_URL}/${bankCardId}`, {
      headers,
      withCredentials: true
    });
  }

  logOutUser() {
    return this.http.post<any>(`${ApiUrls.LOG_OUT_URL}`, {withCredentials: true}
    );
  }
}

