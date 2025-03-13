import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulBookingPageComponent } from './successful-booking-page.component';

describe('SuccessfulBookingPageComponent', () => {
  let component: SuccessfulBookingPageComponent;
  let fixture: ComponentFixture<SuccessfulBookingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessfulBookingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfulBookingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
