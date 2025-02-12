import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return <string>localStorage.getItem('token');
  }
}
