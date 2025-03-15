import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenService} from '../token.service';
import {ApiUrls} from '../api-urls';

@Component({
  selector: 'app-verify-mail-page',
  standalone: false,

  templateUrl: './verify-mail-page.component.html',
  styleUrl: './verify-mail-page.component.css'
})
export class VerifyMailPageComponent {
  isCodeSend = false;
  currentUser: any;
  code: string[] = new Array(6).fill('');
  correctCode: string = "F9KN4A";
  isError: boolean = false;


  constructor(private http : HttpClient,
              private tokenService: TokenService) {
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    console.log("Stored user", storedUser);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  sendCodeToMail() {
    const token = this.currentUser.emailVerification.token;

    const url = `${ApiUrls.POST_VERIFY_EMAIL_URL}?token=${token}`;

    this.isCodeSend = true;

    this.http.post(url, {}, { withCredentials: true }).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error("Error sending code:", error);
      }
    );
  }


  moveToNext(event: any, index: number) {
    const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
    const inputValue = event.target.value;

    if (inputValue.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }

    if (event.inputType === 'deleteContentBackward' && index > 0) {
      inputs[index - 1].focus();
    }
  }

  validateCode() {
    const enteredCode = this.getEnteredCode();
    console.log("Введённый код:", enteredCode);

    if (enteredCode !== this.correctCode) {
      this.isError = true;
      console.log("Код неверный!");
    } else {
      this.isError = false;
      console.log("Код правильный!");
    }
  }

  getEnteredCode(): string {
    const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
    return Array.from(inputs).map(input => input.value).join('');
  }
}
