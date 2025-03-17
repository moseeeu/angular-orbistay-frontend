import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiUrls} from '../api-urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BookingService} from '../booking.service';
import {TokenService} from '../token.service';

@Component({
  selector: 'app-booking-page',
  standalone: false,

  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})
export class BookingPageComponent {
  room: any;
  hotel: any;
  hotelGrade: string = "";
  currentUser: any;
  bookingMail: string = "";
  bookingPhone: string = "";
  bookingName: string = "";
  bookingSurname: string = "";
  selectedCountry: any;
  guestNames: string[] = [];
  allNamesFilled: boolean = false;

  bookingCardName: string = "";
  bookingCardNumber: string = "";
  bookingDate: string = "";
  bookingCVV: string = "";

  checkInTimeRequest: any;
  checkOutTimeRequest: any;
  checkInTime: string | null = "";
  checkOutTime: string | null = "";
  freeCancellationDate: string | null = "";
  nights: number = 0;

  paymentMethods: any;
  isCardToggleDown: boolean = false;
  isFreeCancellation: boolean = false;
  bankCards: any;
  isAddBankCard: boolean = true;
  selectedPayment: string = '';
  saveCardDetails: boolean = false;

  isProcessing: boolean = false;
  bookingRequest: any;
  bookingError: boolean = false;

  activeContent: string = 'your-details';

  countries: any[] = [];

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private bookingService: BookingService,
              private router: Router,
              private tokenService: TokenService,) {}

  ngOnInit() {
    const roomData = localStorage.getItem('roomData');
    const hotelData = localStorage.getItem('hotelData');
    if (roomData && hotelData) {
      this.room = JSON.parse(roomData);
      this.hotel = JSON.parse(hotelData);
      console.log(this.room)
      console.log(this.hotel)
    } else {
      console.error('No hotel and room data');
    }
    this.checkInTimeRequest = localStorage.getItem('checkInTime');
    this.checkOutTimeRequest  = localStorage.getItem('checkOutTime');

    this.checkInTime =  this.checkInTimeRequest ? this.formatDate(this.checkInTimeRequest) : 'N/A';
    this.checkOutTime = this.checkOutTimeRequest ? this.formatDate(this.checkOutTimeRequest) : 'N/A';
    this.freeCancellationDate = this.checkOutTimeRequest ? this.getCancellationDate(this.checkOutTime) : 'N/A';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.http.get<any>(ApiUrls.GET_MY_BOOKINGS_URL, {headers, withCredentials: true}).subscribe(
      (myBookingsResponse) => {
        console.log("My bookings", myBookingsResponse)
      }
    )

    switch (true) {
      case (this.hotel.avgRate === 0):
        this.hotelGrade = "No rating";
        break;
      case (this.hotel.avgRate < 6):
        this.hotelGrade = "Value stay";
        break;
      case (this.hotel.avgRate < 8 && this.hotel.avgRate >= 6):
        this.hotelGrade = "Good";
        break;
      case (this.hotel.avgRate < 9 && this.hotel.avgRate >= 8):
        this.hotelGrade = "Very good";
        break;
      case (this.hotel.avgRate <= 10 && this.hotel.avgRate >= 9):
        this.hotelGrade = "Excellent";
        break;
    }

    if (this.checkInTimeRequest && this.checkOutTimeRequest) {
      this.nights = this.calculateNights(this.checkInTimeRequest, this.checkOutTimeRequest);
    }

    const storedUser = localStorage.getItem('userData');
    console.log("Stored user", storedUser);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.bookingPhone = this.currentUser.phone;
      this.bookingMail = this.currentUser.email;

      if (this.currentUser.bankCards != null) {
        this.bankCards = this.currentUser.bankCards;
      }

      this.getCountriesList();
      console.log(this.selectedCountry);
    }
    this.guestNames = new Array(this.room.capacity).fill("");
  }

  maskCardNumber(cardNumber: string): string {
    return cardNumber.replace(/^(\d{4})\d{8}(\d{4})$/, '$1 **** **** $2');
  }

  getCancellationDate(checkOut: string): string {
    if (this.hotel.bookingCancelRule != null) {
      const inDate = new Date(checkOut);

      inDate.setHours(inDate.getHours() - this.hotel.bookingCancelRule.appealIfCancelledBeforeHours);

      return inDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } else {
      return '';
    }
  }

  calculateNights(checkIn: string, checkOut: string): number {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const diffMs = outDate.getTime() - inDate.getTime();

    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
        },
        error: (err) => {
          console.error("Failed to load countries:", err);
        }
      });
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  validatePhone(phone: string): boolean {
    const phonePattern = /^\+?[0-9]{10,15}$/;
    return phonePattern.test(phone);
  }

  validateCardNumber(cardNumber: string): boolean {
    const cardPattern = /^\d{16}$/;
    return cardPattern.test(cardNumber);
  }

  validateCVV(cvv: string): boolean {
    const cvvPattern = /^\d{3}$/;
    return cvvPattern.test(cvv);
  }

  validateDate(date: string): boolean {
    const datePattern = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
    return datePattern.test(date);
  }

  checkAllNamesFilled() {
    this.allNamesFilled = this.guestNames.every(name => name.trim() !== "");
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  showContent(contentId: string) {
    if (this.saveCardDetails) {
      for (let i = 0; i < this.currentUser.bankCards.length; i++) {
        console.log(this.currentUser.bankCards[i].cardNumber)
        if (this.currentUser.bankCards[i].cardNumber == this.bookingCardNumber) {
          alert("This card already save!");
          this.saveCardDetails = false;
          return;
        }
      }
    }
    if (this.activeContent == 'payment-details' && contentId == 'your-details') this.activeContent = contentId;

    if (this.activeContent == 'your-details' && (!this.bookingMail.trim() ||
      !this.bookingPhone.trim() ||
      !this.bookingName.trim() ||
      !this.bookingSurname.trim() ||
      !this.selectedCountry ||
      !this.allNamesFilled)) {

      alert("Please fill in all fields");
      return;
    }

    if (this.activeContent == 'your-details') {
      if (!this.validateEmail(this.bookingMail)) {
        alert("Please enter a valid email");
        return;
      }

      if (!this.validatePhone(this.bookingPhone)) {
        alert("Please enter a valid phone number");
        return;
      }
    }

    if (this.activeContent == 'payment-details' && (!this.bookingCardName.trim() ||
      !this.bookingCardNumber.trim() ||
      !this.bookingDate.trim() ||
      !this.bookingCVV.trim() ||
      this.selectedPayment == '')) {

      alert("Please fill in all fields");
      return;
    }

    if (this.activeContent == 'payment-details') {
      if (!this.validateCardNumber(this.bookingCardNumber)) {
        alert("Please enter the correct card number (16 digits)");
        return;
      }

      if (!this.validateCVV(this.bookingCVV)) {
        alert("The CVV code must contain 3 digits");
        return;
      }

      if (!this.validateDate(this.bookingDate)) {
        alert("Please enter a valid card expiration date");
        return;
      }
    }

    if (this.activeContent == 'confirmation-details' && contentId == 'your-details') {
      return;
    }
    this.activeContent = contentId;

    if (this.activeContent == 'confirmation-details') {
      this.isProcessing = true;
      const requestBody = {
        "hotelRoomId": this.room.id,
        "checkIn": this.checkInTimeRequest,
        "checkOut": this.checkOutTimeRequest,
        "firstName": this.bookingName,
        "lastName": this.bookingSurname,
        "email": this.bookingMail,
        "phone": this.bookingPhone,
        "countryId": this.selectedCountry.id,
      }

      console.log("requestBody", JSON.stringify(requestBody));

      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`
      });

      this.http.post<any>(ApiUrls.POST_BOOKING_HOTEL_URL, requestBody, { headers, withCredentials: true}).subscribe(
        (response) => {
          console.log(response)
          this.bookingRequest = response;
        },
        (error) => {
          console.log(error);
          switch (error.status) {
            case 403:
              alert("Your passport is expired!")
              this.router.navigate([`/hotel/${this.hotel.id}`]);
              this.bookingError = true;
              return;
            case 0:
              alert("Unknown error")
              this.router.navigate([`/hotel/${this.hotel.id}`]);
              this.bookingError = true;
              return;
            case 409:
              alert("Booking not available right now")
              this.router.navigate([`/hotel/${this.hotel.id}`]);
              this.bookingError = true;
              return;
            default:
              break;
          }
        }
      )

      console.log("PAYMENT METHOD", this.selectedPayment);
      setTimeout(() => {
        const paymentRequestBody = {
          "bookingId": this.bookingRequest.id,
          "amount": this.room.costPerNight * this.nights,
          "paymentMethod": this.selectedPayment == "card" ? "CARD" : "CASH",
          "currency": "USD",
        }

        if (this.selectedPayment == 'card') {
          console.log("PAYMENT REQUEST");
          this.http.post<any>(ApiUrls.POST_PAYMENT_URL, paymentRequestBody, { headers, withCredentials: true}).subscribe(
            (response) => {
              console.log(response)
            },
            (error) => {
              switch (error.status) {
                case 404:
                  alert("Booking not found")
                  this.router.navigate([`/hotel/${this.hotel.id}`]);
                  this.bookingError = true;
                  return;
                case 400:
                  alert("Invalid data")
                  this.router.navigate([`/hotel/${this.hotel.id}`]);
                  this.bookingError = true;
                  return;
                default:
                  break;
              }
            }
          )
        }
      }, 3000);

      if (!this.bookingError) {
        setTimeout(() => {
          this.isProcessing = false;
          this.router.navigate(['/successfulBooking']);
        }, 4000);
      }
    }
  }

  cardsToggleClick() {
    this.isCardToggleDown = !this.isCardToggleDown;
  }

  chooseCard(card: any) {
    for (let i = 0; i < this.bankCards.length; i++) {
      if (this.bankCards[i] === card) {
        this.bookingCardName = card.cardHolderName;
        this.bookingCardNumber = card.cardNumber;
        this.bookingDate = card.expirationDate;
        this.bookingCVV = card.cvv;
      }
    }
    this.isAddBankCard = false;
    this.isCardToggleDown = !this.isCardToggleDown;
  }
  addBankCard() {
    this.isAddBankCard = true;
    this.bookingCardName = "";
    this.bookingCardNumber = "";
    this.bookingDate = "";
    this.bookingCVV = "";
    this.isCardToggleDown = !this.isCardToggleDown;
  }

  onPaymentChange(value: string) {
    this.selectedPayment = value;
  }
}
