import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-guest-review-modal-window',
  standalone: false,

  templateUrl: './guest-review-modal-window.component.html',
  styleUrl: './guest-review-modal-window.component.css'
})
export class GuestReviewModalWindowComponent {
  @Input() review: any;
  @Output() closeModal = new EventEmitter<void>();

  ngOnInit() {

  }

  close() {
    this.closeModal.emit();
  }
}
