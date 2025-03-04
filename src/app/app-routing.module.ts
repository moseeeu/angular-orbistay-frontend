import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {RegistrationPageComponent} from './registration-page/registration-page.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AccountPageComponent} from './account-page/account-page.component';
import {SearchResultsPageComponent} from './search-results-page/search-results-page.component';
import {RedirectAuthenticationPageComponent} from './redirect-authentication-page/redirect-authentication-page.component';
import {HotelPageComponent} from './hotel-page/hotel-page.component';
import {BookingPageComponent} from './booking-page/booking-page.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'registration', component: RegistrationPageComponent},
  {path: 'account', component: AccountPageComponent},
  {path: 'search', component: SearchResultsPageComponent},
  {path: 'authRedirect', component: RedirectAuthenticationPageComponent},
  {path: 'hotel', component: HotelPageComponent},
  {path: 'booking', component: BookingPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
