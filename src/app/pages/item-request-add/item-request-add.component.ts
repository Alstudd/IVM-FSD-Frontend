import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { ItemService, Item } from '../../services/item.service';

@Component({
  selector: 'app-item-request-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-request-add.component.html',
  styleUrls: ['./item-request-add.component.css'],
})
export class ItemRequestAddComponent implements OnInit {
  requestForm: FormGroup;
  departments: string[] = [
    'IT',
    'HR',
    'Finance',
    'Operations',
    'Marketing',
    'Sales',
    'Customer Support',
  ];
  isSubmitting = false;
  formError = '';
  items: Item[] = [];
  filteredItems: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private authService: AuthService,
    private itemService: ItemService
  ) {
    this.requestForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.minLength(3)]],
      quantityRequired: ['', [Validators.required, Validators.min(1)]],
      department: ['', Validators.required],
      purpose: ['', [Validators.required, Validators.minLength(10)]],
      requestorName: ['', Validators.required],
      requestorContact: [''],
    });
  }

  ngOnInit(): void {
    // Load items from the database
    this.loadItems();

    // Pre-fill requestor name from auth service
    const userName = this.authService.getUserName();
    if (userName) {
      this.requestForm.patchValue({ requestorName: userName });
    }
    this.requestForm.get('requestorName')?.disable();
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.items = items;
        this.filteredItems = items;
      },
      error: (err) => {
        console.error('Error loading items', err);
      },
    });
  }

  filterItems(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
  }

  onSubmit(): void {
    this.formError = '';
    if (this.requestForm.valid) {
      this.requestForm.get('requestorName')?.enable();
      this.isSubmitting = true;
      this.requestService.createRequest(this.requestForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          // Navigate to request list or show success message
          this.router.navigate(['/item-requests']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error adding item request', err);
          this.formError =
            err.error?.message ||
            'Failed to add item request. Please try again.';
        },
      });
    }
  }

  // Convenience getters for form controls
  get itemName() {
    return this.requestForm.get('itemName');
  }

  get quantityRequired() {
    return this.requestForm.get('quantityRequired');
  }

  get department() {
    return this.requestForm.get('department');
  }

  get purpose() {
    return this.requestForm.get('purpose');
  }

  get requestorName() {
    return this.requestForm.get('requestorName');
  }
}
