import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMailPageComponent } from './verify-mail-page.component';

describe('VerifyMailPageComponent', () => {
  let component: VerifyMailPageComponent;
  let fixture: ComponentFixture<VerifyMailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyMailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyMailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
