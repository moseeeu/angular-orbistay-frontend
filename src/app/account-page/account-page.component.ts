import { Component, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiUrls} from '../api-urls';

@Component({
  selector: 'app-account-page',
  standalone: false,

  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css'
})
export class AccountPageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  currentUser: any;
  activeContent: string = 'content1';
  firstLetter: string = '';
  private currentUserSubject = new BehaviorSubject<any>(null);
  constructor(public appComponent: AppComponent, public router: Router, public http: HttpClient) { }

  username: string | undefined = 'Alexandr Kalyan';
  displayName: string | undefined = 'User123';
  email: string | undefined  = 'user@example.com';
  phone: string | undefined = '+380 50 123 4567';
  birthDate: string | undefined = 'Enter your date of birth';
  nationality: string | undefined = 'Select the country/region you are from';
  gender: string | undefined = 'Select your gender';
  address: string | undefined = 'Add your address';
  passportDetails: string | undefined = 'Not provided';

  userFields = [
    { label: 'Name', value: this.username, type: '', verified: false, description: '', editing: false },
    { label: 'Display name', value: this.displayName, type: '', verified: false, description: '', editing: false },
    { label: 'Email address', value: this.email, type: 'mail', verified: true, description: 'This is the email address you use to sign in. It’s also where we send your booking confirmation.', editing: false },
    { label: 'Phone number', value: this.phone, type: 'mail', verified: false, description: 'Properties or attractions you book will use this number if they need to contact you.', editing: false },
    { label: 'Date of birth', value: this.birthDate, type: '', verified: false, description: '', editing: false },
    { label: 'Nationality', value: this.nationality, type: '', verified: false, description: '', editing: false },
    { label: 'Gender', value: this.gender, type: '', verified: false, description: '', editing: false },
    { label: 'Address', value: this.address, type: '', verified: false, description: '', editing: false },
    { label: 'Passport details', value: this.passportDetails, type: '', verified: false, description: '', editing: false }
  ];
  preferences = [
    { label: 'Currency', value: 'UAH Ukraine Hryvnia', editing: false },
    { label: 'Language', value: 'American English', editing: false }
  ];

  saveField() {
    this.username = this.userFields.find(f => f.label === 'Name')?.value;
    this.displayName = this.userFields.find(f => f.label === 'Display name')?.value;
    this.email = this.userFields.find(f => f.label === 'Email address')?.value;
    this.phone = this.userFields.find(f => f.label === 'Phone number')?.value;
    this.birthDate = this.userFields.find(f => f.label === 'Date of birth')?.value;
    this.nationality = this.userFields.find(f => f.label === 'Nationality')?.value;
    this.gender = this.userFields.find(f => f.label === 'Gender')?.value;
    this.address = this.userFields.find(f => f.label === 'Address')?.value;
    this.passportDetails = this.userFields.find(f => f.label === 'Passport details')?.value;

    const updatedData = {
      username: this.username,
      displayName: this.displayName,
      email: this.email,
      phone: this.phone,
      birthDate: this.birthDate,
      nationality: this.nationality,
      gender: this.gender,
      address: this.address,
      passportDetails: this.passportDetails
    };

    this.http.put(ApiUrls.PUT_USER_URL, updatedData)
      .subscribe(
        response => console.log('Data updated successfully:', response),
        error => console.error('Error updating data:', error)
      );
  }
  cancelEdit(field: { editing: boolean; }) {
    field.editing = false;
  }

  toggleEdit(field: { editing: boolean; }) {
    field.editing = !field.editing;
  }
  savePreference(preference: { editing: boolean; }) {
    preference.editing = false;
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUserSubject.next(this.currentUser);
      this.firstLetter = this.currentUser.username[0].toUpperCase();
      console.log("user info", this.currentUser);
    }
    else {
      console.log('No user data found in localStorage');
    }
  }

  showContent(contentId: string) {
    this.activeContent = contentId;
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0];
      console.log('Выбран файл:', selectedFile.name);
    }
  }
}
