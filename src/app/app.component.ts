import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentUser: any = null;
  isPopupVisible: boolean = false;
  firstLetter$ = new BehaviorSubject<string>('');
  constructor(public router: Router) {}

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
    this.updateUserData(this.currentUser);
    this.isPopupVisible = !this.isPopupVisible;
    window.location.reload();
  }

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUserSubject.next(this.currentUser);
      this.firstLetter$.next(this.getFirstLetter());
    } else {
      console.log('No user data found in localStorage');
    }

    this.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.firstLetter$.next(this.getFirstLetter());
    });
  }

  updateUserData(userData: any) {
    this.currentUser = userData;
    this.currentUserSubject.next(this.currentUser);
    localStorage.setItem('userData', JSON.stringify(userData));

    this.firstLetter$.next(this.getFirstLetter());
  }

  getLoginStatus() {
    return this.currentUser != null;
  }
}
