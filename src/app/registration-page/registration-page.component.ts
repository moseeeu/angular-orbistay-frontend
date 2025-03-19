import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-registration-page',
  standalone: false,

  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {
  username: string = '';
  password: string = '';
  repeatPassword: string = '';
  email: string = '';
  isValidationActive: boolean = false;

  registrationResponse: any;
  token: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  registerUser() {
    this.authService.registerUser(this.username, this.email, this.password)
      .subscribe(
        (response) => {
          this.token = response.accessToken;
          this.registrationResponse = response;
          localStorage.setItem('token', this.token);
          if (this.token != null) {
            this.authService.getUserInfo().subscribe(
              data => {
                this.authService.updateUserData(data);
                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                  window.location.reload();
                }, 1000);
                setTimeout(() => {
                  this.router.navigate(['']);
                }, 950);
              }
            );
          }
        },
        (error) => {
          if (error.status == 400) {
            alert("Error, enter valid data");
          } else if (error.status == 409) {
            alert("Error, user with such username or email already exists");
          }
        }
      );
  }
  loginUserByGoogle() {
    this.authService.loginUserByGoogle()
  }

  getEmailValid() {
    if (this.email == "") {
      return false;
    }
    else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(this.email);
    }
  }
  getPasswordValid() {
    if (this.password == "") {
      return false;
    }
    else {
      const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
      return passwordPattern.test(this.password);
    }
  }
  getUsernameValid() {
    if (this.username == "") {
      return false;
    }
    else {
      const usernamePattern = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/;
      return usernamePattern.test(this.username);
    }
  }
  getSignUpButtonDisabled() {
    return (this.email != "" && this.password != "" && this.username != "");
  }

  signUpClick(): void {
    this.isValidationActive = true;
    if ((this.getEmailValid() || this.getPasswordValid() || this.getUsernameValid()) &&
      this.email != "" && this.password != "" && this.username != "") {
      console.log("validation ok")
      this.registerUser()
    }
  }
}
