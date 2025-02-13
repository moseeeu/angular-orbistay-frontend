import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {AuthService} from './auth.service';
import {TokenService} from './token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private tokenSubscription: Subscription | undefined;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  currentUser: any = null;
  isPopupVisible: boolean = false;
  firstLetter$ = new BehaviorSubject<string>('');
  avatar: any;

  constructor(public router: Router,
              private authService: AuthService,
              private tokenService: TokenService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.popup-menu') && !target.closest('.user-button')) {
      this.isPopupVisible = false;
    }
  }

  getFirstLetter(): string {
    return this.currentUser?.name?.charAt(0).toUpperCase() || '';
  }

  togglePopup(event: Event) {
    event.stopPropagation();
    this.isPopupVisible = !this.isPopupVisible;
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.currentUserSubject.next(this.currentUser);
    this.isPopupVisible = !this.isPopupVisible;
    window.location.reload();
    this.authService.logOutUser();
  }

  ngOnInit(): void {
    this.startTokenRefresh();
    this.authService.getUserInfo();
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUserSubject.next(this.currentUser);
      this.avatar = this.currentUser.avatarUrl;
      this.firstLetter$.next(this.getFirstLetter());
    } else {
      console.log('No user data found in localStorage');
    }

    this.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.firstLetter$.next(this.getFirstLetter());
    });
  }

  startTokenRefresh() {
    this.intervalId = setInterval(() => {
      this.tokenSubscription = this.tokenService.refreshOldToken().subscribe({
        next: (response) => {
          console.log("update token", response);
          localStorage.setItem('token', response.token);
        },
      });
    },180000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

  getLoginStatus() {
    return this.currentUser != null;
  }
}
