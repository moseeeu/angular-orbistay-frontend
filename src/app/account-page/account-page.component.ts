import { Component, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {AuthService} from '../auth.service';

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
  constructor(public appComponent: AppComponent, public router: Router, public http: HttpClient, private auth: AuthService) { }

  username: string | undefined = '';
  displayName: string | undefined = '';
  email: string | undefined  = '';
  phone: string | undefined = '';
  birthDate: string | undefined = 'Enter your date of birth';
  nationality: string | undefined = 'Select the country/region you are from';
  gender: string | undefined = 'Select your gender';
  address: string | undefined = 'Add your address';
  passportDetails: string | undefined = 'Not provided';

  passportData = {
    name: '',
    surname: '',
    country: '',
    number: '',
    validFrom: '',
    validTo: '',
    agree: false
  };
  name: string = "";
  surname: string = "";
  countries: any[] = [];
  selectedCountry: string = 'Ukraine';
  selectedMonth: string = '01';
  month: any[] = [
    { name: '01-Jan', code: '01' },
    { name: '02-Feb', code: '02' },
    { name: '03-Mar', code: '03' },
    { name: '04-Apr', code: '04' },
    { name: '05-May', code: '05' },
    { name: '06-Jun', code: '06' },
    { name: '07-Jul', code: '07' },
    { name: '08-Aug', code: '08' },
    { name: '09-Sep', code: '09' },
    { name: '10-Oct', code: '10' },
    { name: '11-Nov', code: '11' },
    { name: '12-Dec', code: '12' },
  ];

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

  saveField(field: any) {
    let updatedData;
    const token = localStorage.getItem('token');
    console.log("Token",token)

    if (field.label === 'Passport details') {
      updatedData = {
        passportData: this.passportData
      };
    } else {
      updatedData = {
        [field.label]: field.value
      };
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.put(ApiUrls.PUT_USER_URL, updatedData, { headers })
      .subscribe(
        response => {
          console.log('Data updated successfully:', response);
          field.editing = false;
        },
        error => console.error('Error updating data:', error)
      );
  }
  cancelEdit(field: any): void {
    field.editing = false;

    if (field.label === 'Passport details') {
      this.passportData = {
        name: '',
        surname: '',
        country: '',
        number: '',
        validFrom: '',
        validTo: '',
        agree: false
      };
    }
  }
  toggleEdit(field: any) {
    field.editing = !field.editing;

    if (field.label === 'Passport details' && field.editing) {
      this.passportData = {
        name: '',
        surname: '',
        country: '',
        number: '',
        validFrom: '',
        validTo: '',
        agree: false
      };
    }
  }
  savePreference(preference: { editing: boolean; }) {
    preference.editing = false;
  }

  ngOnInit() {
    this.getCountriesList()
    if (!this.auth.hasToken()) { this.router.navigate(['/login']); }
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

  getCountriesList() {
    this.http.get('https://restcountries.com/v3.1/all')
      .subscribe((response: any) => {
        this.countries = response
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        this.selectedCountry = this.countries.find(country => country.name === 'Ukraine');
        console.log(this.selectedCountry);
      });
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
