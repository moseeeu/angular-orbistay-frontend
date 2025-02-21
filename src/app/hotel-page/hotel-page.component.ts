import {Component, HostListener, ViewChild} from '@angular/core';
import {MatDateRangePicker} from '@angular/material/datepicker';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-hotel-page',
  standalone: false,

  templateUrl: './hotel-page.component.html',
  styleUrl: './hotel-page.component.css'
})
export class HotelPageComponent {
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
  breadcrumb: { label: string; url: string }[] = [];
  selectedCityForCrumbBar: any;

  activeSection: string = 'overview';
  sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'info', label: 'Apartment info & price' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'reviews', label: 'Guest reviews' }
  ];
  public avatar: any;
  public currentUser: any;

  isModalOpen = false;


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
    { name: 'Beautiful View', icon: 'hotel-facilities/beautiful-view.svg' },
    { name: 'Flatscreen TV', icon: 'hotel-facilities/flatscreen-tv.svg' },
    { name: 'Free Parking', icon: 'hotel-facilities/free-parking.svg' },
    { name: 'Free Wi-Fi', icon: 'hotel-facilities/free-wi-fi.svg' },
    { name: 'Hair Dryer', icon: 'hotel-facilities/hair-dryer.svg' },
    { name: 'Iron', icon: 'hotel-facilities/iron.svg' },
    { name: 'King-sized Bed', icon: 'hotel-facilities/king-sized-bed.svg' },
    { name: 'Mini Bar', icon: 'hotel-facilities/mini-bar.svg' },
    { name: 'Modern Amenities', icon: 'hotel-facilities/modern-amenities.svg' },
    { name: 'Private Balcony', icon: 'hotel-facilities/private-balcony.svg' },
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }

  ngOnInit() {
    const selectedCityCrumb = localStorage.getItem('selectedCityForCrumbBar');
    const filteredHotelsFromStorage = localStorage.getItem('filteredHotels');
    this.selectedCityForCrumbBar = selectedCityCrumb ? JSON.parse(selectedCityCrumb) : null;

    this.updateBreadcrumb();
    this.router.events.subscribe(() => {
      this.updateBreadcrumb();
    });

    const storedUser = localStorage.getItem('userData');
    console.log("Stored user", storedUser);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.avatar = this.currentUser.avatarUrl;
      console.log("User info", this.currentUser);
    } else {
      console.log('No user data found in localStorage');
    }
  }

  updateBreadcrumb(): void {
    const urlSegments = this.route.snapshot.url.map(segment => segment.path);
    const queryParams = this.route.snapshot.queryParams;

    this.breadcrumb = [{ label: 'Home', url: '' }];

    this.breadcrumb.push({ label: 'Test country', url: '' });
    this.breadcrumb.push({ label: 'Test city', url: '' });
    this.breadcrumb.push({ label: 'Test hotel', url: '' });
  }

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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
