import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteHotelsPageComponent } from './favourite-hotels-page.component';

describe('FavouriteHotelsPageComponent', () => {
  let component: FavouriteHotelsPageComponent;
  let fixture: ComponentFixture<FavouriteHotelsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouriteHotelsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteHotelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
