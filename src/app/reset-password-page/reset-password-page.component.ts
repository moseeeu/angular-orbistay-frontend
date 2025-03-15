import { Component } from '@angular/core';
import {TokenService} from '../token.service';
import {HttpClient} from '@angular/common/http';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-reset-password-page',
  standalone: false,

  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.css'
})
export class ResetPasswordPageComponent {
    isCodeSend = false;
    isButtonDisabled = false;
    email: string = "";
    timer = 60;
    private timerSubscription: Subscription | null = null;

  constructor(private http : HttpClient,
                private tokenService: TokenService) {
    }

    ngOnInit(): void {

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
