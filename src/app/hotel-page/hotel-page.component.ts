import {Component, HostListener, ViewChild} from '@angular/core';
import {MatDateRangePicker} from '@angular/material/datepicker';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ApiUrls} from '../api-urls';
import {TokenService} from '../token.service';
import {HotelsService} from '../hotels.service';
import {BookingService} from '../booking.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-hotel-page',
  standalone: false,

  templateUrl: './hotel-page.component.html',
  styleUrl: './hotel-page.component.css'
})
export class HotelPageComponent {
  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  range1: FormGroup;
  range2: FormGroup;
  isCityDropdownOpen = false;
  cities = [
    { name: 'New York', country: 'USA' },
    { name: 'Zurich', country: 'Switzerland' },
    { name: 'London', country: 'UK' },
    { name: 'Tokyo', country: 'Japan' }
  ];
  filteredCities = [...this.cities];
  filteredRooms: any[] = [];
  selectedCity = '';
  isPeopleDropdownOpen = false;
  isPeopleRoomsDropdownOpen = false;
  adults = 2;
  children = 0;
  breadcrumb: { label: string; url: string }[] = [];
  popularDestinations: any;
  similarDestinations: any;
  selectedCityForCrumbBar: any;
  requestBody: any;
  countryId: any;
  isInFavourite: any;
  favouriteId: any;

  activeSection: string = 'overview';
  sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'info', label: 'Apartment info & price' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'reviews', label: 'Guest reviews' }
  ];
  public avatar: any;
  public currentUser: any = null;

  isModalOpen = false;

  hotelId: number | null = null;
  hotel: any = null;
  hotelGrade: any;
  hotelImages: string[] = [];
  hotelRoomsList: any[] = [];
  selectedRoom: any = null;
  reviews: any[] = [];
  currentIndex: number = 0;
  reviewsPerPage: number = 3;
  selectedReview: any = null;
  checkInTime: any = null;
  checkOutTime: any = null;
  roomCapacity: any = null;

  hotel_highlights = [
    { name: 'Airport Shuttle', icon: 'hotel-highlights/airport_shuttle.svg' },
    { name: 'Business Center', icon: 'hotel-highlights/business_center.svg' },
    { name: 'Concierge Service', icon: 'hotel-highlights/concierge_service.svg' },
    { name: 'Eco Friendly', icon: 'hotel-highlights/eco_friendly.svg' },
    { name: 'Fitness Center', icon: 'hotel-highlights/fitness_center.svg' },
    { name: 'Free Breakfast', icon: 'hotel-highlights/free_breakfast.svg' },
    { name: 'Free Parking', icon: 'hotel-highlights/free_parking.svg' },
    { name: 'Kids Club', icon: 'hotel-highlights/kids_club.svg' },
    { name: 'Live Entertainment', icon: 'hotel-highlights/live_entertainment.svg' },
    { name: 'Personal Bathroom', icon: 'hotel-highlights/personal_bathroom.svg' },
    { name: 'Pet Friendly', icon: 'hotel-highlights/pet_friendly.svg' },
    { name: 'Private Beach', icon: 'hotel-highlights/private_beach.svg' },
    { name: 'Rooftop Bar', icon: 'hotel-highlights/rooftop_bar.svg' },
    { name: 'Room Service', icon: 'hotel-highlights/room_service.svg' },
    { name: 'Spa Services', icon: 'hotel-highlights/spa_services.svg' },
    { name: 'Swimming Pool', icon: 'hotel-highlights/swimming_pool.svg' },
  ];

  hotel_facilities = [
    { name: 'Air Conditioning', icon: 'hotel-facilities/air-conditioning.svg' },
    { name: 'Antique Furniture', icon: 'hotel-facilities/antique-furniture.svg' },
    { name: 'City View', icon: 'hotel-facilities/beautiful-view.svg' },
    { name: 'Flat-Screen TV', icon: 'hotel-facilities/flatscreen-tv.svg' },
    { name: 'Free Parking', icon: 'hotel-facilities/free-parking.svg' },
    { name: 'Free WiFi', icon: 'hotel-facilities/free-wi-fi.svg' },
    { name: 'Hair Dryer', icon: 'hotel-facilities/hair-dryer.svg' },
    { name: 'Iron', icon: 'hotel-facilities/iron.svg' },
    { name: 'King-sized Bed', icon: 'hotel-facilities/king-sized-bed.svg' },
    { name: 'Mini Bar', icon: 'hotel-facilities/mini-bar.svg' },
    { name: 'Modern Amenities', icon: 'hotel-facilities/modern-amenities.svg' },
    { name: 'Balcony', icon: 'hotel-facilities/private-balcony.svg' },
    { name: 'Single Bed', icon: 'hotel-facilities/single-bed.svg' },
    { name: 'Telephone', icon: 'hotel-facilities/telephone.svg' },
    { name: 'Work Desk', icon: 'hotel-facilities/work-desk.svg' },
  ];
  room_amenities = [
    'Towels',
    'Toilet',
    'Heating',
    'Slippers',
    'Wardrobe',
    'Cable channels',
    'Mini-bar',
    'Toilet paper',
  ];

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionId;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['overview', 'info', 'facilities', 'reviews'];
    for (let section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  checkHighlight(hotelHighlights: any[], highlightName: string): boolean {
    return hotelHighlights.some(highlight => highlight.name === highlightName);
  }

  getFilteredFacilities(): any[] {
    const uniqueFacilities = new Map<string, any>();

    this.hotelRoomsList.forEach(room => {
      room.roomFacilityLinks.forEach((facility: { name: string }) => {
        if (!uniqueFacilities.has(facility.name)) {
          const matchedFacility = this.hotel_facilities.find(hf => hf.name === facility.name);

          if (matchedFacility) {
            uniqueFacilities.set(facility.name, {
              name: facility.name,
              icon: matchedFacility.icon
            });
          }
        }
      });
    });

    return Array.from(uniqueFacilities.values());
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private hotelsService: HotelsService,
    private tokenService: TokenService,
    private bookingService: BookingService,
    private spinner: NgxSpinnerService
  ) {
    this.range1 = this.fb.group({
      start: [null],
      end: [null],
    });
    this.range2 = this.fb.group({
      start: [null],
      end: [null],
    });
    const navigation = this.router.getCurrentNavigation();
    this.hotel = navigation?.extras.state?.['hotel'];
    console.log("Hotel Info", this.hotel);
  }

  ngOnInit() {
    const selectedCityCrumb = localStorage.getItem('selectedCityForCrumbBar');
    this.selectedCityForCrumbBar = selectedCityCrumb ? JSON.parse(selectedCityCrumb) : null;

    this.hotelsService.rooms$.subscribe((rooms) => {
      this.filteredRooms = rooms;
    });

    const savedRooms = localStorage.getItem('filteredRooms');
    if (savedRooms) {
      this.filteredRooms = JSON.parse(savedRooms);
      this.hotelsService.setFilteredRooms(this.filteredRooms);
    }

    const checkInTime = localStorage.getItem('checkInTime');
    const checkOutTime = localStorage.getItem('checkOutTime');
    if (checkInTime && checkOutTime) {
      const startDate = new Date(checkInTime);
      startDate.setDate(startDate.getDate() + 1);

      const endDate = new Date(checkOutTime);
      endDate.setDate(endDate.getDate() + 1);

      this.range1.patchValue({
        start: startDate,
        end: endDate,
      });
      this.range2.patchValue({
        start: startDate,
        end: endDate,
      });
    }

    this.getPopularDestinations();

    this.adults = localStorage.getItem('adultsSearch') ? +localStorage.getItem('adultsSearch')! : 0;
    this.children = localStorage.getItem('childrenSearch') ? +localStorage.getItem('childrenSearch')! : 0;
    this.selectedCity = localStorage.getItem('citySearch') || '';

    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.hotelId) {
      this.loadHotelData();
      this.tokenService.refreshAccessToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`
      });
      this.http.post<any>(`${ApiUrls.POST_RECENTLY_VIEWED_HOTEL}/${this.hotelId}`, {}, { headers, withCredentials: true }).subscribe(
        (response) => console.log(response),
        (error) => console.error('Ошибка:', error)
      );
    }

    this.hotelsService.favouriteHotels$.subscribe((favourites) => {
      this.isInFavourite = favourites.some((hotel) => hotel.id === this.hotelId);
    });

    this.updateBreadcrumb();
    this.router.events.subscribe(() => this.updateBreadcrumb());

    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.avatar = this.currentUser.avatarUrl;
      console.log("User info", this.currentUser);
    } else {
      console.log('No user data found in localStorage');
    }

    setTimeout(() => {
      if (this.hotel?.imagesUrls?.length > 1) {
        this.hotelImages = [...this.hotel.imagesUrls];
        this.hotelImages.shift();

        for (let room of this.hotel.hotelRooms as any[]) {
          this.http.get(`${ApiUrls.GET_HOTEL_ROOMS}/${room.id}`).subscribe(response => {
            if (response != null) this.hotelRoomsList.push(response);
          });
        }

        switch (true) {
          case (this.hotel.avgRate === 0):
            this.hotelGrade = "No rating";
            break;
          case (this.hotel.avgRate < 6):
            this.hotelGrade = "Value stay";
            break;
          case (this.hotel.avgRate < 8 && this.hotel.avgRate >= 6):
            this.hotelGrade = "Good";
            break;
          case (this.hotel.avgRate < 9 && this.hotel.avgRate >= 8):
            this.hotelGrade = "Very good";
            break;
          case (this.hotel.avgRate <= 10 && this.hotel.avgRate >= 9):
            this.hotelGrade = "Excellent";
            break;
        }

        this.reviews = this.hotel.reviews;
      }
    }, 1000);
  }

  checkFacility(roomFacilities: any[], facilityName: string): boolean {
    return roomFacilities.some(facility => facility.name === facilityName);
  }

  loadHotelData() {
    const apiUrl = `${ApiUrls.GET_HOTEL_BY_ID_URL}/${this.hotelId}`;
    this.http.get(apiUrl).subscribe(
      (response) => {
        this.hotel = response;
        console.log("Loaded hotel data:", this.hotel);
      },
      (error) => {
        console.error("Failed to load hotel data:", error);
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
  copyPageUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        alert(err);
      });
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
  togglePeopleRoomsDropdown() {
    this.isPeopleRoomsDropdownOpen = !this.isPeopleRoomsDropdownOpen;
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
    const startDate = this.range1?.value?.start ? this.formatDate(this.range1.value.start) : "";
    const endDate = this.range1?.value?.end ? this.formatDate(this.range1.value.end) : "";

    if (this.selectedCity.length < 2 || startDate === "" || endDate === "" || peopleCount === 0) {
      alert("Please enter valid data in search bar");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDateObj = new Date(startDate);

    if (startDateObj < today) {
      alert("Check-in date cannot be earlier than today");
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
        valuations: ["EXCELLENT"],
        stars: ["ONE_STAR"]
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

  filterRoomsClick() {
    const startDate = this.range2?.value?.start ? this.formatDate(this.range2.value.start) : "";
    const endDate = this.range2?.value?.end ? this.formatDate(this.range2.value.end) : "";
    const peopleCount = this.adults + this.children || "";
    const isChildrenFriendly = this.children > 0 ? "true" : "false";

    if (startDate === "" || endDate === "" || peopleCount === 0) {
      alert("Please enter valid data in search bar");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDateObj = new Date(startDate);

    if (startDateObj < today) {
      alert("Check-in date cannot be earlier than today");
      return;
    }

    localStorage.setItem('checkInTime', startDate);
    localStorage.setItem('checkOutTime', endDate);
    localStorage.setItem('adultsSearch', this.adults.toString());
    localStorage.setItem('childrenSearch', this.children.toString());

    let params = new HttpParams()
      .set('hotelId', this.hotel.id)
      .set('peopleCount', peopleCount)
      .set('isChildrenFriendly', isChildrenFriendly)
      .set('checkIn', startDate)
      .set('checkOut', endDate)
      .set('minPrice', '0')
      .set('maxPrice', '99999');

    this.hotelsService.getFilteredRooms(ApiUrls.GET_FILTERED_HOTEL_ROOMS, params).subscribe(
      (response) => {
        console.log("Filtered rooms", response);
        this.hotelsService.setFilteredRooms(response);
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          this.filteredRooms = response;
          localStorage.setItem('filteredRooms', JSON.stringify(response));
        }, 200);
      },
      (error) => {
        console.error('Error fetching filtered rooms:', error);
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          this.hotelsService.setFilteredRooms([]);
          this.filteredRooms = [];
        }, 200);
      }
    );
  }

  formatDateTime(hours: number): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}${hours.toString().padStart(2, '0')}:00:00`;
  }

  openModal(room: any) {
    this.selectedRoom = room;
    this.isModalOpen = true;
  }
  openReviewModal(review: any) {
    if (review == this.hotel.id && this.currentUser == null) {
      this.router.navigate(['/login']);
    }
    this.selectedReview = review;
  }

  closeReviewModal() {
    this.selectedReview = null;
  }
  getVisibleReviews() {
    return this.reviews.slice(this.currentIndex, this.currentIndex + this.reviewsPerPage);
  }

  nextReviews() {
    if (this.currentIndex + this.reviewsPerPage < this.reviews.length) {
      this.currentIndex += this.reviewsPerPage;
    }
  }

  prevReviews() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.reviewsPerPage;
    }
  }
  closeModal() {
    this.isModalOpen = false;
  }

  addToFavourites() {
    if (!this.tokenService.hasToken()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.isInFavourite) {
      this.hotelsService.addToFavourites(this.hotelId!);
    } else {
      this.hotelsService.removeFromFavourites(this.hotelId!);
    }
  }

  viewRoomDetails(room: any, hotel: any) {
    if (this.tokenService.getToken() != null) {
      localStorage.setItem('roomData', JSON.stringify(room));
      localStorage.setItem('hotelData', JSON.stringify(hotel));
      this.bookingService.setRoomData(room, hotel);
      this.router.navigate(['/booking']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
