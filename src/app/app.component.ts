import { Component } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-orbistay-frontend';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private isLoggedIn = false;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUserSubject.next(this.currentUser);
    } else {
      console.log('No user data found in localStorage');
    }

    this.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    console.log(this.currentUser);
  }

  updateUserData(userData: any) {
    this.currentUser = userData;
    this.currentUserSubject.next(this.currentUser);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getLoginStatus() {
    return this.isLoggedIn;
  }
}
