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

@Component({
  selector: 'app-item-request-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="request-update-container">
      <div class="request-update-card">
        <h2>Update Item Request</h2>
        <form
          *ngIf="requestForm"
          [formGroup]="requestForm"
          (ngSubmit)="onSubmit()"
          class="request-form"
        >
          <!-- Item Name -->
          <div class="form-group">
            <label for="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              formControlName="itemName"
              [class.invalid]="
                itemName?.invalid && (itemName?.dirty || itemName?.touched)
              "
            />
            <div
              *ngIf="
                itemName?.invalid && (itemName?.dirty || itemName?.touched)
              "
              class="error-message"
            >
              <small *ngIf="itemName?.errors?.['required']"
                >Item name is required</small
              >
              <small *ngIf="itemName?.errors?.['minlength']"
                >Item name must be at least 3 characters</small
              >
            </div>
          </div>

          <!-- Quantity Required -->
          <div class="form-group">
            <label for="quantityRequired">Quantity</label>
            <input
              type="number"
              id="quantityRequired"
              formControlName="quantityRequired"
              [class.invalid]="
                quantityRequired?.invalid &&
                (quantityRequired?.dirty || quantityRequired?.touched)
              "
            />
            <div
              *ngIf="
                quantityRequired?.invalid &&
                (quantityRequired?.dirty || quantityRequired?.touched)
              "
              class="error-message"
            >
              <small *ngIf="quantityRequired?.errors?.['required']"
                >Quantity is required</small
              >
              <small *ngIf="quantityRequired?.errors?.['min']"
                >Quantity must be greater than 0</small
              >
            </div>
          </div>

          <!-- Department -->
          <div class="form-group">
            <label for="department">Department</label>
            <select
              id="department"
              formControlName="department"
              [class.invalid]="
                department?.invalid &&
                (department?.dirty || department?.touched)
              "
            >
              <option value="">Select Department</option>
              <option *ngFor="let dept of departments" [value]="dept">
                {{ dept }}
              </option>
            </select>
            <div
              *ngIf="
                department?.invalid &&
                (department?.dirty || department?.touched)
              "
              class="error-message"
            >
              <small *ngIf="department?.errors?.['required']"
                >Department is required</small
              >
            </div>
          </div>

          <!-- Purpose -->
          <div class="form-group">
            <label for="purpose">Purpose</label>
            <textarea
              id="purpose"
              formControlName="purpose"
              [class.invalid]="
                purpose?.invalid && (purpose?.dirty || purpose?.touched)
              "
            ></textarea>
            <div
              *ngIf="purpose?.invalid && (purpose?.dirty || purpose?.touched)"
              class="error-message"
            >
              <small *ngIf="purpose?.errors?.['required']"
                >Purpose is required</small
              >
              <small *ngIf="purpose?.errors?.['minlength']"
                >Purpose must be at least 10 characters</small
              >
            </div>
          </div>

          <!-- Requestor Name -->
          <div class="form-group">
            <label for="requestorName">Your Name</label>
            <input
              type="text"
              id="requestorName"
              formControlName="requestorName"
              [class.invalid]="
                requestorName?.invalid &&
                (requestorName?.dirty || requestorName?.touched)
              "
            />
            <div
              *ngIf="
                requestorName?.invalid &&
                (requestorName?.dirty || requestorName?.touched)
              "
              class="error-message"
            >
              <small *ngIf="requestorName?.errors?.['required']"
                >Your name is required</small
              >
            </div>
          </div>

          <!-- Requestor Contact (Optional) -->
          <div class="form-group">
            <label for="requestorContact">Contact Information</label>
            <input
              type="text"
              id="requestorContact"
              formControlName="requestorContact"
            />
          </div>

          <!-- Status (for Admin/Manager) -->
          <div *ngIf="isAdminOrManager" class="form-group">
            <label for="status">Request Status</label>
            <select
              id="status"
              formControlName="status"
              [class.invalid]="
                status?.invalid && (status?.dirty || status?.touched)
              "
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="requestForm.invalid"
            class="submit-button"
          >
            Update Request
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .request-update-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #fff5e6, #ffebd2);
        padding: 2rem;
      }

      .request-update-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1),
          0 5px 15px rgba(0, 0, 0, 0.07);
        padding: 2.5rem;
        width: 100%;
        max-width: 600px;
        transition: all 0.3s ease;
      }

      .request-update-card h2 {
        text-align: center;
        color: #ff6b00;
        margin-bottom: 2rem;
        font-size: 2rem;
      }

      .request-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        color: #333;
        font-weight: 600;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: 0.75rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #ff6b00;
        box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);
      }

      .form-group input.invalid,
      .form-group select.invalid,
      .form-group textarea.invalid {
        border-color: #d32f2f;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.8rem;
      }

      .submit-button {
        background-color: #ff6b00;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        font-weight: bold;
        margin-top: 1rem;
      }

      .submit-button:hover {
        background-color: #e55b00;
        transform: translateY(-3px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
          0 3px 6px rgba(0, 0, 0, 0.08);
      }

      .submit-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    `,
  ],
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

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check user role
    const role = this.authService.getUserRole();
    this.isAdminOrManager = role === 'ADMIN' || role === 'MANAGER';

    // Get request ID from route
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));

    // Load request details
    this.loadRequestDetails();
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
            requestorName: [request.requestorName, Validators.required],
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
    if (this.requestForm && this.requestForm.valid && this.requestId) {
      const updatedRequest = { ...this.requestForm.value, id: this.requestId };

      this.requestService
        .updateRequest(this.requestId, updatedRequest)
        .subscribe({
          next: () => {
            // Navigate to request list or show success message
            this.router.navigate(['/item-requests']);
          },
          error: (err) => {
            console.error('Error updating request', err);
            // Handle error (show error message)
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
