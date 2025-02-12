import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-redirect-authentication-page',
  standalone: false,

  templateUrl: './redirect-authentication-page.component.html',
  styleUrl: './redirect-authentication-page.component.css'
})
export class RedirectAuthenticationPageComponent {
  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private appComponent: AppComponent) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];
      if (accessToken && refreshToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        this.authService.getUserInfo().subscribe(
          data => {
            this.appComponent.updateUserData(data);
            this.router.navigate(['']);
          }
        );
      } else {
        console.error('Токены не найдены в URL');
      }
    });
  }
}
