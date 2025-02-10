import {Component, HostListener, Input, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDateRangePicker} from '@angular/material/datepicker';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {HotelsService} from '../hotels.service';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-main-page',
  standalone: false,

  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  //------------------SEARCH BAR------------------
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
  //------------------ACCOUNT------------------
  isLogin:boolean = false;
  //------------------HOTELS------------------
  hotels = [
    {
      title: 'Swiss Art Apartment City Center',
      location: 'Zurich, Switzerland',
      rating: 7.4,
      reviews: 46,
      image: 'path-to-image-1.jpg'
    },
    {
      title: 'The Bowery Hotel',
      location: 'New York, USA',
      rating: 10,
      reviews: 80,
      image: 'path-to-image-2.jpg'
    },
    {
      title: 'Swiss Art Apartment City Center',
      location: 'Zurich, Switzerland',
      rating: 7.4,
      reviews: 46,
      image: 'path-to-image-1.jpg'
    },
    {
      title: 'The Bowery Hotel',
      location: 'New York, USA',
      rating: 10,
      reviews: 80,
      image: 'path-to-image-2.jpg'
    },
  ];
  popularHotels: any;
  popularDestinations: any;
  selectedCityForCrumbBar: any;
  requestBody: any;
  //------------------------------------MAIN PAGE LOGIC------------------------------------
  constructor(private fb: FormBuilder, private http: HttpClient, private hotelsService: HotelsService, private auth: AuthService) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }
   test() {
    console.log("Testing click")
   }
  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    if (storedUser != null) this.isLogin = true
    else this.isLogin = false;
    console.log(this.isLogin);
    console.log(storedUser);
    this.loadPopularHotels();
    this.getPopularDestinations();
    this.isLogin = this.auth.hasToken();
  }
  loadPopularHotels() {
    this.hotelsService.getHotelsByApi(ApiUrls.GET_POPULAR_HOTELS_URL).subscribe(
      (hotels) => {
        this.popularHotels = hotels;
        console.log('Popular Hotels:', this.popularHotels);
      },
      (error) => {
        console.error('Error fetching popular hotels:', error);
      }
    );
  }
  getPopularDestinations(){
    this.http.get(ApiUrls.GET_POPULAR_DESTINATIONS_URL).subscribe(
      (destination) => {
        this.popularDestinations = destination;
        console.log('Popular destin:', this.popularDestinations);
      }
    )
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

  selectCity(pickedCity: { city: string, country: {id: string, name: string, code: string} }) {
    this.selectedCity = pickedCity.city;
    this.selectedCityForCrumbBar = pickedCity;
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
    if (this.selectedCityForCrumbBar) {
      const countryId = this.selectedCityForCrumbBar.country?.id || "";
      const peopleCount = this.adults + this.children || "";
      const isChildrenFriendly = this.children > 0 ? "true" : "false";
      const startDate = this.range?.value?.start ? this.formatDate(this.range.value.start) : "";
      const endDate = this.range?.value?.end ? this.formatDate(this.range.value.end) : "";

      this.requestBody = {
        name: "",
        city: this.selectedCityForCrumbBar.city || "",
        countryId: countryId || "",
        peopleCount: peopleCount || "",
        isChildrenFriendly: isChildrenFriendly || "",
        checkIn: startDate || "",
        checkOut: endDate || "",
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
    } else {
      this.selectedCityForCrumbBar = {};
      this.requestBody = {
        name: "",
        city: "",
        countryId: "",
        peopleCount: "",
        isChildrenFriendly: "",
        checkIn: "",
        checkOut: "",
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
    }
    localStorage.setItem('selectedCityForCrumbBar', JSON.stringify(this.selectedCityForCrumbBar));
    this.hotelsService.getFilteredHotels(ApiUrls.GET_FILTER_HOTELS_URL, this.requestBody).subscribe(
      (hotels) => {
        console.log("Filtered from main page", hotels)
        localStorage.setItem('filteredHotels', JSON.stringify(hotels));
      },
      (error) => {
        console.error('Error fetching filtered hotels:', error);
      }
    );

  }

}
