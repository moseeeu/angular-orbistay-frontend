import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectAuthenticationPageComponent } from './redirect-authentication-page.component';

describe('RedirectAuthenticationPageComponent', () => {
  let component: RedirectAuthenticationPageComponent;
  let fixture: ComponentFixture<RedirectAuthenticationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedirectAuthenticationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectAuthenticationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
