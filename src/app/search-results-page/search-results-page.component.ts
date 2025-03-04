import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MatDateRangePicker} from '@angular/material/datepicker';
import {HotelsService} from '../hotels.service';
import {ApiUrls} from '../api-urls';
import {HttpClient} from '@angular/common/http';

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
  cityName: any;
  filteredCities = [...this.cities];
  selectedCity = '';
  isPeopleDropdownOpen = false;
  adults = 2;
  children = 0;
  popularDestinations: any;
  similarDestinations: any;
  selectedCityForCrumbBar: any;
  requestBody: any;
  countryId: any;
  //------------------------------------FILTER VARIABLES------------------------------------
  filteredHotels: any;
  breadcrumb: { label: string; url: string }[] = [];
  @ViewChild('slider') slider!: ElementRef;
  selectedValuations: string[] = [];
  selectedStars: string[] = [];
  minValue: number = 0;
  maxValue: number = 99;
  filteredHotelsList: any[] = [];
  selectedSorting: any = 'rating';
  starsMapping: { [key: string]: number } = {
    'ONE_STAR': 1,
    'TWO_STARS': 2,
    'THREE_STARS': 3,
    'FOUR_STARS': 4,
    'FIVE_STARS': 5
  };



  updateSlider() {
    if (this.minValue > this.maxValue) {
      [this.minValue, this.maxValue] = [this.maxValue, this.minValue];
    }
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private hotelsService: HotelsService,
              private http: HttpClient) {

    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.hotelsService.hotels$.subscribe((hotels) => {
      if (hotels.length > 0) {
        this.filteredHotels = hotels;
      } else {
        const storedHotels = localStorage.getItem('filteredHotels');
        this.filteredHotels = storedHotels ? JSON.parse(storedHotels) : [];
      }
      this.filteredHotelsList = this.filteredHotels.hotels;
      console.log("Filtered hotels:", this.filteredHotels);
    });

    this.loadFilteredHotels();
  }
  loadFilteredHotels() {
    const selectedCityCrumb = localStorage.getItem('selectedCityForCrumbBar');
    const filteredHotelsFromStorage = localStorage.getItem('filteredHotels');
    this.selectedCityForCrumbBar = selectedCityCrumb ? JSON.parse(selectedCityCrumb) : null;
    this.filteredHotels = filteredHotelsFromStorage ? JSON.parse(filteredHotelsFromStorage) : null;
    this.cityName = this.selectedCityForCrumbBar;

    if (this.filteredHotels) {
      this.filteredHotels.hotelsCountByStars = this.filteredHotels.hotelsCountByStars.sort((a: { hotelStars: any; }, b: { hotelStars: any; }) => {
        return this.extractNumber(a.hotelStars) - this.extractNumber(b.hotelStars);
      });
    }

    console.log("Filtered hotels from storage:", this.filteredHotels);
    console.log('Search city', this.selectedCityForCrumbBar);
    this.updateBreadcrumb();
  }

  extractNumber(hotelStars: string): number {
    const mapping: { [key: string]: number } = {
      'ONE_STAR': 1,
      'TWO_STARS': 2,
      'THREE_STARS': 3,
      'FOUR_STARS': 4,
      'FIVE_STARS': 5
    };
    return mapping[hotelStars] || 0;
  }

  updateBreadcrumb(): void {
    const urlSegments = this.route.snapshot.url.map(segment => segment.path);
    const queryParams = this.route.snapshot.queryParams;

    this.breadcrumb = [{ label: 'Home', url: '' }];

    if (JSON.stringify(this.selectedCityForCrumbBar) !== '{}') {
      this.breadcrumb.push({label: this.selectedCityForCrumbBar.country.name, url: ''})
      this.breadcrumb.push({label: this.selectedCityForCrumbBar.city, url: ''})
    }

    this.breadcrumb.push({ label: 'Search results', url: '' });
  }

  toggleValuationFilter(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedValuations.push(value);
    } else {
      this.selectedValuations = this.selectedValuations.filter(v => v !== value);
    }
    this.applyFilters();
  }

  toggleStarFilter(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedStars.push(value);
    } else {
      this.selectedStars = this.selectedStars.filter(s => s !== value);
    }
    this.applyFilters();
  }

  applyFilters() {
    if (!this.filteredHotels || !this.filteredHotels.hotels) {
      return;
    }

    if (this.selectedValuations.length === 0 &&
      this.selectedStars.length === 0 &&
      !this.minValue &&
      !this.maxValue) {
      this.filteredHotelsList = [...this.filteredHotels.hotels];
      return;
    }

    let filteredList: any[] = [];

    const starsMapping: { [key: number]: string } = {
      1: 'ONE_STAR',
      2: 'TWO_STARS',
      3: 'THREE_STARS',
      4: 'FOUR_STARS',
      5: 'FIVE_STARS'
    };

    console.log(this.selectedValuations);

    for (let i: number = 0; i < this.filteredHotels.hotels.length; i++) {
      let hotel: any = this.filteredHotels.hotels[i];

      let valuationCategory: string = '';

      if (hotel.avgRate !== undefined && hotel.avgRate !== null) {
        if (hotel.avgRate === 0) {
          valuationCategory = '';
        } else if (hotel.avgRate < 8) {
          valuationCategory = 'GOOD';
        } else if (hotel.avgRate >= 8 && hotel.avgRate < 9) {
          valuationCategory = 'VERY_GOOD';
        } else if (hotel.avgRate >= 9) {
          valuationCategory = 'EXCELLENT';
        }
      }

      let hotelStarsString: string = starsMapping[hotel.stars] || '';

      let matchesValuation: boolean = this.selectedValuations.length === 0 ||
        this.selectedValuations.includes(valuationCategory);

      let matchesStars: boolean = this.selectedStars.length === 0 ||
        this.selectedStars.includes(hotelStarsString);

      let matchesPrice: boolean = (hotel.hotelRoom.costPerNight >= this.minValue) &&
        (hotel.hotelRoom.costPerNight <= this.maxValue);

      console.log(this.maxValue);


      if (matchesValuation && matchesStars && matchesPrice) {
        filteredList.push(hotel);
      }
    }

    this.filteredHotelsList = filteredList;
  }

  applySorting() {
    if (!this.filteredHotelsList || this.filteredHotelsList.length === 0) {
      return;
    }

    this.filteredHotelsList.sort((a, b) => {
      if (this.selectedSorting === 'expensive') {
        return b.hotelRoom.costPerNight - a.hotelRoom.costPerNight || b.avgRate - a.avgRate;
      } else if (this.selectedSorting === 'cheap') {
        return a.hotelRoom.costPerNight - b.hotelRoom.costPerNight || b.avgRate - a.avgRate;
      } else if (this.selectedSorting === 'rating') {
        return b.avgRate - a.avgRate || b.hotelRoom.costPerNight - a.hotelRoom.costPerNight;
      }
      return 0;
    });
  }

  //------------------------------------SEARCH BAR LOGIC------------------------------------
  toggleCityDropdown() {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
  }

  getSimilarDestinations(destination: string) {
    const params = { text: destination };

    this.http.get<any[]>(ApiUrls.GET_SIMILAR_DESTINATIONS_URL, { params }).subscribe({
      next: (response) => {
        this.similarDestinations = response;
        if (this.similarDestinations.length != 0) {
          this.countryId = this.similarDestinations[0].country.id;
        }
        this.selectedCityForCrumbBar = this.similarDestinations[0];
        console.log('Similar destinations:', this.similarDestinations);
      },
      error: (err) => {
        console.error("Error fetching similar destinations:", err);
      }
    });
  }

  filterCities(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(query)
    );
    if (this.selectedCity.length < 2) {
      this.similarDestinations = [];
      return;
    }
    this.getSimilarDestinations(this.selectedCity);
  }

  selectCity(pickedCity: { city: string, country: {id: string, name: string, code: string} }) {
    this.selectedCity = pickedCity.city;
    this.isCityDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.city-selector-field')) {
      this.isCityDropdownOpen = false;
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-field')) {
      this.isPeopleDropdownOpen = false;
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  searchButtonClick() {
    const countryId = this.countryId || "";
    const peopleCount = this.adults + this.children || "";
    const isChildrenFriendly = this.children > 0 ? "true" : "false";
    const startDate = this.range?.value?.start ? this.formatDate(this.range.value.start) : "";
    const endDate = this.range?.value?.end ? this.formatDate(this.range.value.end) : "";

    if (this.selectedCity.length < 2 || startDate == "" || endDate == "" || peopleCount == 0) {
      alert("Please enter valid data in search bar");
      return;
    }

    this.requestBody = {
      name: "",
      city: this.selectedCity || "",
      countryId: countryId || "",
      peopleCount: peopleCount || "",
      isChildrenFriendly: isChildrenFriendly || "",
      checkIn: startDate,
      checkOut: endDate,
      filters: {
        minPrice: "0",
        maxPrice: "99999",
        valuations: [
          "EXCELLENT"
        ],
        stars: [
          "ONE_STAR"
        ]
      }
    };

    localStorage.setItem('selectedCityForCrumbBar', JSON.stringify(this.selectedCityForCrumbBar));

    localStorage.removeItem('filteredHotels');

    this.hotelsService.getFilteredHotels(ApiUrls.GET_FILTER_HOTELS_URL, this.requestBody).subscribe(
      (hotels) => {
        console.log("Hotels received:", hotels);

        this.hotelsService.setFilteredHotels(hotels);

        localStorage.setItem('filteredHotels', JSON.stringify(hotels));

        window.location.reload();
      },
      (error) => {
        console.error('Error fetching filtered hotels:', error);
      }
    );

  }
}
