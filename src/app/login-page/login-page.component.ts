import { Component } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {ApiUrls} from '../api-urls';

@Component({
  selector: 'app-login-page',
  standalone: false,

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  token: string = '';
  status: string = '';

  constructor(private authService: AuthService, private router: Router, private appComponent: AppComponent) {}

  loginUser() {
    this.authService.loginUser(this.email, this.password)
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          if (this.token != null) {
            this.authService.getUserInfo().subscribe(
              data => {
                this.appComponent.updateUserData(data);
                this.router.navigate(['']);
              }
            );
          }
        },
        (error) => {
          if (error.status == 400) alert("Error, invalid data provided!")
          else if (error.status == 401) alert("Error, incorrect username or email or password!");
          else if (error.status == 404) alert("Error, can not find authenticated user by provided email!");
        }
      );
  }
  loginUserByGoogle() {
    this.authService.loginUserByGoogle()
  }
}
