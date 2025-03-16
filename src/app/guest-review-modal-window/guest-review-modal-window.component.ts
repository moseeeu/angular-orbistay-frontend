import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HotelsService} from '../hotels.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpHeaders} from '@angular/common/http';
import {TokenService} from '../token.service';

@Component({
  selector: 'app-guest-review-modal-window',
  standalone: false,

  templateUrl: './guest-review-modal-window.component.html',
  styleUrl: './guest-review-modal-window.component.css'
})
export class GuestReviewModalWindowComponent {
  @Input() review: any;
  @Output() closeModal = new EventEmitter<void>();

  isCreateReview: boolean = false;
  currentUser: any;
  ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedRating: number | null = null;
  goodRev: string = "";
  badRev: string = "";
  fullRev: string = "";

  constructor(private hotelService: HotelsService, private spinner: NgxSpinnerService,
              private tokenService: TokenService) {}

  ngOnInit() {
    if (!isNaN(Number(this.review)) && Number(this.review) > 0) {
      this.isCreateReview = true;

      const storedUser = localStorage.getItem('userData');
      if (storedUser) this.currentUser = JSON.parse(storedUser);
      console.log(this.currentUser);
    }
  }

  saveReview() {
    if (this.fullRev == "") {
      alert("Please enter your review");
      return;
    }
    if (this.selectedRating == null) {
      alert("Please choose rating for review");
      return;
    }

    const requestBody = {
      "hotelId": this.review,
      "content": this.fullRev,
      "rate": this.selectedRating,
      "pros": this.goodRev.trim() ? this.goodRev : null,
      "cons": this.badRev.trim() ? this.badRev : null
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.hotelService.createReview(requestBody, headers).subscribe(
      (response) => {
        console.log(response);
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          this.isCreateReview = false;
          window.location.reload();
        }, 1000);
      },
      (err) => {
        switch (err.status) {
          case 400:
            alert("Sorry, the connection to the site is not stable now, try later");
            break;
          case 404:
            alert("Hotel not found");
            break;
          case 500:
            alert("Sorry, the connection to the site is not stable now, try later");
            break;
          default:
            break;
        }
        this.close();
      }
    )

  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  close() {
    if (this.review == 'createReview') this.isCreateReview = false;
    this.closeModal.emit();
  }
}
