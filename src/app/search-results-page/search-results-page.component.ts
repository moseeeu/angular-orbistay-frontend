import {Component, Input} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search-results-page',
  standalone: false,

  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.css'
})
export class SearchResultsPageComponent {
  protected range: FormGroup;
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.range = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.updateBreadcrumbs();
    this.router.events.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs(): void {
    const urlSegments = this.route.snapshot.url.map(segment => segment.path);
    const queryParams = this.route.snapshot.queryParams;

    this.breadcrumbs = [{ label: 'Home', url: '' }];

    if (urlSegments.includes('usa')) {
      this.breadcrumbs.push({ label: 'USA', url: '/usa' });
    }

    if (urlSegments.includes('new-york')) {
      this.breadcrumbs.push({ label: 'New York', url: '/usa/new-york' });
    }

    if (queryParams['category']) {
      this.breadcrumbs.push({ label: queryParams['category'], url: this.router.url });
    }

    if (queryParams['date']) {
      this.breadcrumbs.push({ label: `Date: ${queryParams['date']}`, url: this.router.url });
    }

    this.breadcrumbs.push({ label: 'Search results', url: '' });
  }
}
