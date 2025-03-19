import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from '../token.service';
import {ApiUrls} from '../api-urls';
import {interval, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-verify-mail-page',
  standalone: false,

  templateUrl: './verify-mail-page.component.html',
  styleUrl: './verify-mail-page.component.css'
})
export class VerifyMailPageComponent {
  isCodeSend = false;
  isButtonDisabled = false;
  email: string = "";
  timer = 60;
  isTokenPresent: boolean = false;
  private timerSubscription: Subscription | null = null;

  constructor(private http : HttpClient,
              private tokenService: TokenService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.isTokenPresent = true;
        console.log('Token найден:', params['token']);
      }
    });
  }

  sendCodeToMail() {
    if (this.validateEmail(this.email)) {
      this.isCodeSend = true;
      this.isButtonDisabled = true;
      this.timer = 60;

      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.isButtonDisabled = false;
          this.timerSubscription?.unsubscribe();
        }
      });
    } else {
      alert("Enter a valid email address");
    }
  }
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
