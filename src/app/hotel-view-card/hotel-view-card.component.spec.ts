import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelViewCardComponent } from './hotel-view-card.component';

describe('HotelViewCardComponent', () => {
  let component: HotelViewCardComponent;
  let fixture: ComponentFixture<HotelViewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelViewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelViewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
