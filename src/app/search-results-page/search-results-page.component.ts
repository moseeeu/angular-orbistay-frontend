import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSliderModule} from '@angular/material/slider';
import {MatDateRangePicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-search-results-page',
  standalone: false,

  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.css'
})
export class SearchResultsPageComponent {
  //------------------------------------SEARCH BAR VARIABLES------------------------------------
  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  protected range: FormGroup;
  isCityDropdownOpen = false;
  cities = [
    { name: 'New York', country: 'USA' },
    { name: 'Zurich', country: 'Switzerland' },
    { name: 'London', country: 'UK' },
    { name: 'Tokyo', country: 'Japan' }
  ];
  filteredCities = [...this.cities];
  selectedCity = '';
  isPeopleDropdownOpen = false;
  adults = 2;
  children = 0;
  //------------------------------------FILTER VARIABLES------------------------------------
  selectedCityForCrumbBar: any;
  breadcrumb: { label: string; url: string }[] = [];
  @ViewChild('slider') slider!: ElementRef;
  minValue = 99;
  maxValue = 99999;


  updateSlider() {
    if (this.minValue > this.maxValue) {
      [this.minValue, this.maxValue] = [this.maxValue, this.minValue];
    }
    console.log(`Min: ${this.minValue}, Max: ${this.maxValue}`);
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const selectedCityCrumb = localStorage.getItem('selectedCityForCrumbBar');
    this.selectedCityForCrumbBar = selectedCityCrumb ? JSON.parse(selectedCityCrumb) : null;

    console.log('Search city', this.selectedCityForCrumbBar);
    this.updateBreadcrumb();
    this.router.events.subscribe(() => {
      this.updateBreadcrumb();
    });

  }

  updateBreadcrumb(): void {
    const urlSegments = this.route.snapshot.url.map(segment => segment.path);
    const queryParams = this.route.snapshot.queryParams;

    this.breadcrumb = [{ label: 'Home', url: '' }];

    this.breadcrumb.push({label: this.selectedCityForCrumbBar.country.name, url: ''})
    this.breadcrumb.push({label: this.selectedCityForCrumbBar.city, url: ''})

    this.breadcrumb.push({ label: 'Search results', url: '' });
  }
  //------------------------------------SEARCH BAR LOGIC------------------------------------
  toggleCityDropdown() {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
  }

  filterCities(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(query)
    );
  }

  selectCity(city: { name: string, country: string }) {
    this.selectedCity = city.name;
    this.isCityDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.city-selector-field')) {
      this.isCityDropdownOpen = false;
    }
  }

  togglePeopleDropdown() {
    this.isPeopleDropdownOpen = !this.isPeopleDropdownOpen;
  }

  changeCount(type: 'adults' | 'children', change: number) {
    if (type === 'adults') {
      this.adults = Math.max(0, this.adults + change);
    } else if (type === 'children') {
      this.children = Math.max(0, this.children + change);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-field')) {
      this.isPeopleDropdownOpen = false;
    }
  }
}
