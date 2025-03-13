import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingsPageComponent } from './my-bookings-page.component';

describe('MyBookingsPageComponent', () => {
  let component: MyBookingsPageComponent;
  let fixture: ComponentFixture<MyBookingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBookingsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBookingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
