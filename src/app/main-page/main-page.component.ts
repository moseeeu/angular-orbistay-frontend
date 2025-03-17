import {Component, HostListener, Input, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDateRangePicker} from '@angular/material/datepicker';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {HotelsService} from '../hotels.service';
import {AuthService} from '../auth.service';
import {TokenService} from '../token.service';
import {tap} from 'rxjs';
import {Router} from '@angular/router';


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
  countryId: any;
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
  recentlyViewedHotels: any;
  popularDestinations: any;
  similarDestinations: any;
  selectedCityForCrumbBar: any;
  requestBody: any;
  //------------------------------------MAIN PAGE LOGIC------------------------------------
  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private hotelsService: HotelsService,
              private router: Router,
              private tokenService: TokenService,) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    this.isLogin = storedUser != null;
    console.log(this.isLogin);
    console.log(storedUser);
    this.loadPopularHotels();
    this.getPopularDestinations();
    this.isLogin = this.tokenService.hasToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    this.http.get<any>(ApiUrls.GET_RECENTLY_VIEWED_HOTELS, { headers, withCredentials: true }).subscribe(
      (response) => {
        console.log("RECENTLY", response);
        this.recentlyViewedHotels = response.length > 4 ? response.slice(0, 4) : response;
      }
    );
    const startDate = this.range?.value?.start ? this.formatDate(this.range.value.start) : "";
    const endDate = this.range?.value?.end ? this.formatDate(this.range.value.end) : "";

    localStorage.removeItem('checkInTime');
    localStorage.removeItem('checkOutTime');
    localStorage.removeItem('adultsSearch');
    localStorage.removeItem('childrenSearch');
    localStorage.removeItem('citySearch');
    localStorage.removeItem('childrenSearch');
  }
  loadPopularHotels() {
    this.hotelsService.getHotelsByApi(ApiUrls.GET_POPULAR_HOTELS_URL).subscribe(
      (response) => {
        this.popularHotels = response.length > 4 ? response.slice(0, 4) : response;
        console.log('Popular Hotels:', this.popularHotels);
      },
      (error) => {
        console.error('Error fetching popular hotels:', error);
      }
    );
  }

  getPopularDestinations() {
    this.http.get<any[]>(ApiUrls.GET_POPULAR_DESTINATIONS_URL).subscribe(
      (destination) => {
        const uniqueDestinations: any[] = [];

        for (const dest of destination) {
          const isDuplicate = uniqueDestinations.some(
            (item) => item && item.city && item.city === dest.city
          );
          if (!isDuplicate) {
            uniqueDestinations.push(dest);
          }
        }

        this.popularDestinations = uniqueDestinations;
        console.log('Popular destin:', this.popularDestinations);
      }
    );
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


  //------------------------------------SEARCH BAR LOGIC------------------------------------
  toggleCityDropdown() {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
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
    this.getSimilarDestinations(this.selectedCity);
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

  redirectToHotelPage(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
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

    localStorage.setItem('checkInTime', startDate);
    localStorage.setItem('checkOutTime', endDate);
    localStorage.setItem('adultsSearch', this.adults.toString());
    localStorage.setItem('childrenSearch', this.children.toString());
    localStorage.setItem('citySearch', this.similarDestinations[0].city);
    localStorage.setItem('selectedCityForCrumbBar', JSON.stringify(this.selectedCityForCrumbBar));

    localStorage.removeItem('filteredHotels');

    this.hotelsService.getFilteredHotels(ApiUrls.GET_FILTER_HOTELS_URL, this.requestBody).subscribe(
      (hotels) => {
        console.log("Hotels received:", hotels);

        this.hotelsService.setFilteredHotels(hotels);

        localStorage.setItem('filteredHotels', JSON.stringify(hotels));

        this.router.navigate(['/search']);
      },
      (error) => {
        console.error('Error fetching filtered hotels:', error);
      }
    );

  }

}
