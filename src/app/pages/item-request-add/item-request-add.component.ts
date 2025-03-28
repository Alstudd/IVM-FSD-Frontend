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

@Component({
  selector: 'app-item-request-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="request-add-container">
      <div class="request-add-card">
        <h2>Create New Item Request</h2>
        <form
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

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="requestForm.invalid"
            class="submit-button"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .request-add-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #fff5e6, #ffebd2);
        padding: 2rem;
      }

      .request-add-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1),
          0 5px 15px rgba(0, 0, 0, 0.07);
        padding: 2.5rem;
        width: 100%;
        max-width: 600px;
        transition: all 0.3s ease;
      }

      .request-add-card h2 {
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

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private authService: AuthService
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
    // Optionally pre-fill requestor name from auth service
    const userName = this.authService.getUserName();
    if (userName) {
      this.requestForm.patchValue({ requestorName: userName });
    }
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.requestService.createRequest(this.requestForm.value).subscribe({
        next: () => {
          // Navigate to request list or show success message
          this.router.navigate(['/item-requests']);
        },
        error: (err) => {
          console.error('Error creating request', err);
          // Handle error (show error message)
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
