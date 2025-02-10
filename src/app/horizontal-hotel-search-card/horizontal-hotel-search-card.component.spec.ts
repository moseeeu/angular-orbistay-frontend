import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalHotelSearchCardComponent } from './horizontal-hotel-search-card.component';

describe('HorizontalHotelSearchCardComponent', () => {
  let component: HorizontalHotelSearchCardComponent;
  let fixture: ComponentFixture<HorizontalHotelSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorizontalHotelSearchCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalHotelSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
