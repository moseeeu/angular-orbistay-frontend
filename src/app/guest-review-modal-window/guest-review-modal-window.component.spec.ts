import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestReviewModalWindowComponent } from './guest-review-modal-window.component';

describe('GuestReviewModalWindowComponent', () => {
  let component: GuestReviewModalWindowComponent;
  let fixture: ComponentFixture<GuestReviewModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestReviewModalWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestReviewModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
