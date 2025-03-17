import { Component, ElementRef, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {BehaviorSubject, count} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {AuthService} from '../auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {TokenService} from '../token.service';

@Component({
  selector: 'app-account-page',
  standalone: false,

  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css'
})
export class AccountPageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  currentUser: any;
  isEmailVerified: boolean = false;
  userFields: any[] = [];
  activeContent: string = 'content1';
  constructor(public router: Router,
              public http: HttpClient,
              private auth: AuthService,
              private spinner: NgxSpinnerService,
              private tokenService: TokenService) { }
  avatar: string | undefined = '';
  isCardEdit: boolean = false;
  bankCards: any;
  isAddNewCard: boolean = false;
  addCardName: string = "";
  addCardNumber: string = "";
  addCardDate: string = "";
  addCardCVV: string = "";

  passportData = {
    issuingCountryId: 1,
    firstName: '',
    lastName: '',
    country: '',
    passportNumber: '',
    validDay: '',
    validMonth: '',
    validYear: '',
    agree: false
  };
  name: string = "";
  countries: any[] = [];
  selectedCountry: any = 'Ukraine';
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
      'Address': 'address',
      'Passport details': 'passport'
    };

    const token = this.tokenService.getToken();
    console.log("Token", token);

    const userFieldKey = fieldMap[field.label];

    if (!userFieldKey) {
      console.error('Unknown field label:', field.label);
      return;
    }

    const updatedData: any = {
      "username": this.currentUser.username == '' ? null : this.currentUser.username,
      "email": this.currentUser.email == '' ? null : this.currentUser.email,
      "phone": this.currentUser.phone == '' ? null : this.currentUser.phone,
      "birthDate": this.currentUser.birthDate == '' ? null : this.currentUser.birthDate,
      "citizenship": this.currentUser.citizenship == '' ? null : this.currentUser.citizenship,
      "gender": this.currentUser.gender == '' ? null : this.currentUser.gender,
      "residency": this.currentUser.residency == '' ? null : this.currentUser.residency,
      "passport": this.currentUser.passport == '' ? null : this.currentUser.passport
    };
    let countryId = 0;

    if (userFieldKey === 'gender') {
      const inputValue = field.value.toLowerCase();

      if (inputValue.includes('male')) {
        field.value = 'MALE';
      } else if (inputValue.includes('female')) {
        field.value = 'FEMALE';
      } else {
        console.error('Invalid gender input:', field.value);
        return;
      }
    }

    else if (userFieldKey === 'phone') {
      const cleanedPhone = field.value.replace(/\D/g, '');

      if (cleanedPhone.length !== 10) {
        alert('Phone number must be exactly 10 digits');
        return;
      }

      updatedData.phone = cleanedPhone;
    }

    else if (userFieldKey === 'birthDate') {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(field.value)) {
        alert("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }

      updatedData.birthDate = field.value;
    }

    else if (userFieldKey === 'address') {
      if (this.currentUser.passport == null) {
        alert("Enter your passport data as first");
        return;
      }
      const addressPattern = /^(.+?)\s\d+,\s(.+)$/;
      console.log("Address",field.value);
      const match = field.value.match(addressPattern);

      if (!match) {
        alert("Address must be in format: 'Street Name №Building, City'");
        return;
      }

      const street = match[1].trim();
      const city = match[2].trim();
      updatedData.address = {
        "countryId": this.currentUser.passport.issuingCountry.id,
        "street": street,
        "city": city
      }
    }

    else if (userFieldKey === 'passport') {
      console.log("Selected country", this.currentUser.passport);
      updatedData.passport = {
        "firstName": this.passportData.firstName,
        "lastName": this.passportData.lastName,
        "passportNumber": this.passportData.passportNumber,
        "countryOfIssuanceId": this.selectedCountry.id,
        "expirationDate": `${this.passportData.validYear}-${this.passportData.validMonth}-${this.passportData.validDay}`
      };
    } else {
      updatedData[userFieldKey] = field.value;
    }
    if (this.currentUser.passport != null) {
      updatedData.citizenshipCountryId = this.selectedCountry.id
      updatedData.passport.countryOfIssuanceId = this.selectedCountry.id
    }

    console.log("request here ->", updatedData);
    this.auth.updateUserInfo(updatedData);
  }

  toggleEdit(field: any) {
    field.editing = !field.editing;
  }
  savePreference(preference: { editing: boolean; }) {
    preference.editing = false;
  }

  ngOnInit() {
    this.getCountriesList();
    this.tokenService.refreshAccessToken();

    if (!this.tokenService.hasToken()) {
      this.router.navigate(['/login']);
      return;
    }

    const storedUser = localStorage.getItem('userData');
    console.log("Stored user", storedUser);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.userFields = this.generateUserFields(this.currentUser);
      if (this.currentUser.passport != null) {
        this.passportData.firstName = this.currentUser.passport.firstName;
        this.passportData.lastName = this.currentUser.passport.lastName;
        this.passportData.passportNumber = this.currentUser.passport.passportNumber;
      }
      this.isEmailVerified = this.currentUser.emailVerification.verified;
      if (this.currentUser.passport?.expirationDate) {
        const [year, month, day] = this.currentUser.passport.expirationDate.split('-');
        this.passportData.validDay = day;
        this.passportData.validMonth = month;
        this.passportData.validYear = year;
      }
      this.avatar = `${this.currentUser.avatarUrl}?t=${new Date().getTime()}`;
      this.bankCards = this.currentUser.bankCards;
      this.bankCards = this.currentUser.bankCards.map((card: any) => ({
        ...card,
        isEdit: false
      }));
      console.log("User bank", this.currentUser);
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
        editing: false,
        placeholder: 'Enter your display name'
      },
      {
        label: 'Email address',
        value: user.email || 'Enter your email address',
        type: 'mail',
        verified: true,
        description: 'This is the email address you use to sign in. It’s also where we send your booking confirmation.',
        editing: false,
        placeholder: 'Enter your email address'
      },
      {
        label: 'Phone number',
        value: user.phone || 'Not provided',
        type: 'phone',
        verified: false,
        description: 'Properties or attractions you book will use this number if they need to contact you.',
        editing: false,
        placeholder: 'Not provided'
      },
      {
        label: 'Date of birth',
        value: user.birthDate || 'Enter your date of birth',
        type: 'date',
        verified: false,
        description: '',
        editing: false,
        placeholder: 'Enter your date of birth'
      },
      {
        label: 'Nationality',
        value: (user.citizenship?.name && user.citizenship.name !== 0) ? user.citizenship.name : 'Select the country/region you are from',
        type: '',
        verified: false,
        description: '',
        editing: false,
        placeholder: 'Select the country/region you are from'
      },
      {
        label: 'Gender',
        value: user.gender || 'Select your gender',
        type: '',
        verified: false,
        description: '',
        editing: false,
        placeholder: 'Select your gender'
      },
      {
        label: 'Address',
        value: (user.resresidency != null) ? user.residency.street + ' ' + user.residency.id + ', ' + user.residency.city : 'Add your address',
        type: '',
        verified: false,
        description: '',
        editing: false,
        placeholder: 'Add your address'
      },
      {
        label: 'Passport details',
        value: user.passport ? 'Provided' : 'Not provided',
        type: '',
        verified: false,
        description: '',
        editing: false
      },
    ];
  }

  getCountriesList() {
    this.http.get<any[]>(ApiUrls.GET_ALL_COUNTRIES_URL)
      .subscribe({
        next: (response) => {
          this.countries = response
            .map((country: any) => ({
              id: country.id,
              name: country.name,
              code: country.code
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          if (this.currentUser?.passport?.issuingCountry?.name) {
            this.selectedCountry = this.countries.find(
              (c) => c.name === this.currentUser.passport.issuingCountry.name
            ) || null;
          }
        },
        error: (err) => {
          console.error("Failed to load countries:", err);
        }
      });
  }

  deleteBankCard(card: any) {
    this.auth.deleteBankCard(card.id).subscribe(
      (response) => {
        console.log(response);
        this.currentUser = JSON.stringify(response);
        localStorage.setItem('userData',this.currentUser);
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          window.location.reload();
        }, 1000);
      }
    )
  }

  clickAddNewCard() {
    this.isAddNewCard = !this.isAddNewCard;
  }

  saveNewCard() {
    const cardNumberRegex = /^\d{16}$/;
    const cardDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cardCVVRegex = /^\d{3}$/;

    for (let i = 0; i < this.bankCards.length; i++) {
      if (this.addCardNumber == this.bankCards[i].cardNumber) {
        alert("This card already in list!");
        return;
      }
    }

    if (this.addCardNumber[0] != '4') {
      alert("Orbistay supports only Visa and Mastercard cards");
      return;
    }

    this.validateCardExpiry()


    if (!this.addCardName.trim()) {
      alert("Cardholder's name cannot be empty!");
      return;
    }

    if (!this.addCardNumber.match(cardNumberRegex)) {
      alert("Card number must be 16 digits!");
      return;
    }

    if (!this.addCardDate.match(cardDateRegex)) {
      alert("Expiry date must be in MM/YY format!");
      return;
    }

    if (!this.addCardCVV.match(cardCVVRegex)) {
      alert("CVV must be exactly 3 digits!");
      return;
    }

    console.log("Card saved successfully!", {
      name: this.addCardName,
      number: this.addCardNumber,
      expiry: this.addCardDate,
      cvv: this.addCardCVV,
    });

    const requestBody = {
      "cardNumber": this.addCardNumber,
      "expirationDate": this.addCardDate,
      "cvv": this.addCardCVV,
      "cardHolderName": this.addCardName
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.http.post<any>(ApiUrls.POST_USER_BANK_CARD_URL, requestBody, {headers, withCredentials: true}).subscribe(
      (response) => {
        console.log(response);
        this.currentUser = JSON.stringify(response);
        localStorage.setItem('userData', JSON.stringify(response));
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          window.location.reload();
        }, 1000);
      },
    )
  }

  validateCardExpiry(): boolean {
    const cardDateRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!this.addCardDate.match(cardDateRegex)) {
      alert("Expiry date must be in MM/YY format!");
      return false;
    }

    const [month, year] = this.addCardDate.split("/").map(num => parseInt(num, 10));

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      alert("Card expiry date is invalid or expired!");
      return false;
    }

    return true;
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
      console.log("ava", selectedFile);
      this.auth.updateUserAvatar(selectedFile).subscribe((response) => {
        console.log("After switch icon response",response);

        localStorage.removeItem('userData');

        localStorage.setItem('userData', JSON.stringify(response));
      });
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
        window.location.reload();
      }, 5000);
    }
  }
  verifyEmail() {
    if (!this.isEmailVerified) {
      this.router.navigate(['/verify-email']);
    }
  }
}
