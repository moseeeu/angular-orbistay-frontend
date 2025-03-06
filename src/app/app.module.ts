import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountPageComponent } from './account-page/account-page.component';
import { SearchResultsPageComponent } from './search-results-page/search-results-page.component';
import {MatFormField} from '@angular/material/form-field';
import {MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker} from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotelViewCardComponent } from './hotel-view-card/hotel-view-card.component';
import { HorizontalHotelSearchCardComponent } from './horizontal-hotel-search-card/horizontal-hotel-search-card.component';
import {MatSlider, MatSliderRangeThumb} from "@angular/material/slider";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {NgOptimizedImage} from "@angular/common";
import {NgxSpinnerComponent} from "ngx-spinner";
import { RedirectAuthenticationPageComponent } from './redirect-authentication-page/redirect-authentication-page.component';
import { HotelPageComponent } from './hotel-page/hotel-page.component';
import { HotelRoomModalPageComponent } from './hotel-room-modal-page/hotel-room-modal-page.component';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { GuestReviewModalWindowComponent } from './guest-review-modal-window/guest-review-modal-window.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    AccountPageComponent,
    SearchResultsPageComponent,
    HotelViewCardComponent,
    HorizontalHotelSearchCardComponent,
    RedirectAuthenticationPageComponent,
    HotelPageComponent,
    HotelRoomModalPageComponent,
    BookingPageComponent,
    GuestReviewModalWindowComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatFormField,
        MatDateRangeInput,
        MatDatepickerToggle,
        MatDateRangePicker,
        MatFormFieldModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatDatepickerModule,
        MatSlider,
        MatSliderRangeThumb,
        NgOptimizedImage,
        NgxSpinnerComponent
    ],
  providers: [


    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
