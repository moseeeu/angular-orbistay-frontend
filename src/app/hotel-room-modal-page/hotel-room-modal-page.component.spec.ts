import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomModalPageComponent } from './hotel-room-modal-page.component';

describe('HotelRoomModalPageComponent', () => {
  let component: HotelRoomModalPageComponent;
  let fixture: ComponentFixture<HotelRoomModalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelRoomModalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelRoomModalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
