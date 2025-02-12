import { Component, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {AuthService} from '../auth.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-account-page',
  standalone: false,

  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css'
})
export class AccountPageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  currentUser: any;
  userFields: any[] = [];
  activeContent: string = 'content1';
  firstLetter: string = '';
  private currentUserSubject = new BehaviorSubject<any>(null);
  constructor(public router: Router, public http: HttpClient, private auth: AuthService,private spinner: NgxSpinnerService) { }
  avatar: string | undefined = '';

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

  preferences = [
    { label: 'Currency', value: 'UAH Ukraine Hryvnia', editing: false },
    { label: 'Language', value: 'American English', editing: false }
  ];

  saveField(field: any) {
    const fieldMap: { [key: string]: string } = {
      'Display name': 'username',
      'Email address': 'email',
      'Phone number': 'phone',
      'Date of birth': 'birthDate',
      'Nationality': 'citizenship',
      'Gender': 'gender',
      'Address': 'residency.street',
      'Passport details': 'passport'
    };

    const token = localStorage.getItem('token');
    console.log("Token", token);

    const userFieldKey = fieldMap[field.label];

    if (!userFieldKey) {
      console.error('Unknown field label:', field.label);
      return;
    }

    const updatedData: any = {
      username: this.currentUser.username,
      email: this.currentUser.email,
      phone: this.currentUser.phone,
      birthDate: this.currentUser.birthDate,
      citizenship: this.currentUser.citizenship,
      gender: this.currentUser.gender,
      residency: {
        street: this.currentUser.residency?.street || '',
        city: this.currentUser.residency?.city || ''
      },
      passport: {
        firstName: this.currentUser.passport?.firstName || '',
        lastName: this.currentUser.passport?.lastName || '',
        passportNumber: this.currentUser.passport?.passportNumber || '',
        countryIssuedCode: this.currentUser.passport?.countryIssuedCode || '',
        expirationDate: this.currentUser.passport?.expirationDate || ''
      }
    };

    if (userFieldKey.startsWith('residency.')) {
      const key = userFieldKey.split('.')[1];
      updatedData.residency[key] = field.value;
    } else if (userFieldKey === 'passport') {
      updatedData.passport = field.value;
    } else {
      updatedData[userFieldKey] = field.value;
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
    this.getCountriesList();
    if (!this.auth.hasToken()) {
      this.router.navigate(['/login']);
      return;
    }
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.userFields = this.generateUserFields(this.currentUser);
      this.avatar = this.currentUser.avatarUrl;
      console.log("User info", this.currentUser);
    } else {
      console.log('No user data found in localStorage');
    }
  }

  generateUserFields(user: any): any[] {
    return [
      {
        label: 'Display name',
        value: user.username || 'Enter your display name',
        type: '',
        verified: false,
        description: '',
        editing: false
      },
      {
        label: 'Email address',
        value: user.email || 'Enter your email address',
        type: 'mail',
        verified: true,
        description: 'This is the email address you use to sign in. It’s also where we send your booking confirmation.',
        editing: false
      },
      {
        label: 'Phone number',
        value: user.phone || 'Not provided',
        type: 'phone',
        verified: false,
        description: 'Properties or attractions you book will use this number if they need to contact you.',
        editing: false
      },
      {
        label: 'Date of birth',
        value: user.birthDate || 'Enter your date of birth',
        type: 'date',
        verified: false,
        description: '',
        editing: false
      },
      {
        label: 'Nationality',
        value: user.citizenship || 'Select the country/region you are from',
        type: '',
        verified: false,
        description: '',
        editing: false
      },
      {
        label: 'Gender',
        value: user.gender || 'Select your gender',
        type: '',
        verified: false,
        description: '',
        editing: false
      },
      {
        label: 'Address',
        value: user.address || 'Add your address',
        type: '',
        verified: false,
        description: '',
        editing: false
      },
      {
        label: 'Passport details',
        value: user.passportDetails || 'Not provided',
        type: '',
        verified: false,
        description: '',
        editing: false
      }
    ];
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
  showLoadingScreen() {
  }
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0];
      console.log("ava", selectedFile);
      this.auth.updateUserAvatar(selectedFile).subscribe((response) => {
        console.log(response);
      });
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
        window.location.reload();
      }, 5000);
    }
  }
}
