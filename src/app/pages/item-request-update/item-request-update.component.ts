import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { ItemService, Item } from '../../services/item.service';

@Component({
  selector: 'app-item-request-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-request-update.component.html',
  styleUrls: ['./item-request-update.component.css'],
})
export class ItemRequestUpdateComponent implements OnInit {
  requestForm: FormGroup | null = null;
  departments: string[] = [
    'IT',
    'HR',
    'Finance',
    'Operations',
    'Marketing',
    'Sales',
    'Customer Support',
  ];
  isAdminOrManager: boolean = false;
  requestId: number | null = null;
  isSubmitting = false;
  formError = '';
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    // Check user role
    const role = this.authService.getUserRole();
    this.isAdminOrManager = role === 'ADMIN' || role === 'MANAGER';

    // Get request ID from route
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));

    // Load available items
    this.loadItems();

    // Load request details
    this.loadRequestDetails();
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

  loadRequestDetails(): void {
    if (this.requestId) {
      this.requestService.getRequestById(this.requestId).subscribe({
        next: (request) => {
          this.requestForm = this.fb.group({
            itemName: [
              request.itemName,
              [Validators.required, Validators.minLength(3)],
            ],
            quantityRequired: [
              request.quantityRequired,
              [Validators.required, Validators.min(1)],
            ],
            department: [request.department, Validators.required],
            purpose: [
              request.purpose,
              [Validators.required, Validators.minLength(10)],
            ],
            requestorName: [
              {
                value: request.requestorName,
                disabled: true,
              },
              Validators.required,
            ],
            requestorContact: [request.requestorContact || ''],
            status: [request.status || 'PENDING'],
          });
        },
        error: (err) => {
          console.error('Error loading request details', err);
          this.router.navigate(['/requests']);
        },
      });
    }
  }

  onSubmit(): void {
    this.formError = '';
    if (this.requestForm && this.requestForm.valid && this.requestId) {
      this.isSubmitting = true;

      // Get both enabled and disabled form values
      const formValues = {
        ...this.requestForm.getRawValue(),
        id: this.requestId,
      };

      this.requestService.updateRequest(this.requestId, formValues).subscribe({
        next: () => {
          this.isSubmitting = false;
          // Navigate to request list or show success message
          this.router.navigate(['/item-requests']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error updating item request', err);
          this.formError =
            err.error?.message ||
            'Failed to update item request. Please try again.';
        },
      });
    }
  }

  // Convenience getters for form controls
  get itemName() {
    return this.requestForm?.get('itemName');
  }

  get quantityRequired() {
    return this.requestForm?.get('quantityRequired');
  }

  get department() {
    return this.requestForm?.get('department');
  }

  get purpose() {
    return this.requestForm?.get('purpose');
  }

  get requestorName() {
    return this.requestForm?.get('requestorName');
  }

  get status() {
    return this.requestForm?.get('status');
  }
}
