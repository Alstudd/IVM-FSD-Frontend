import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService, Item } from '../../../services/item.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="item-detail-wrapper" *ngIf="item">
      <div class="item-detail-container">
        <div class="item-detail-card">
          <div class="item-header">
            <div class="item-title-section">
              <h2 style="margin-bottom: 10px;">{{ item.name }}</h2>
              <div
                class="status-badge"
                [ngClass]="{
                  'high-stock': item.quantityAvailable >= 20,
                  'medium-stock':
                    item.quantityAvailable >= 10 && item.quantityAvailable < 20,
                  'low-stock': item.quantityAvailable < 10
                }"
              >
                {{ item.quantityAvailable }} in Stock
              </div>
            </div>
            <div class="item-tag-section">
              <span class="item-tag" *ngIf="item.category">
                {{ item.category }}
              </span>
            </div>
          </div>

          <div class="item-details-grid">
            <div
              style="border-radius: 12px 12px 0px 0px; border-bottom: 1px solid #e0e0e0;"
              class="detail-section vendor-info"
            >
              <h3 style="margin-bottom: 10px;">Vendor Details</h3>
              <div class="vendor-detail">
                <div class="detail-icon">🏢</div>
                <div class="detail-text">
                  <p>{{ item.vendorName || 'Not specified' }}</p>
                  <small>{{ item.vendorContact || 'No contact info' }}</small>
                </div>
              </div>
            </div>

            <div
              style="border-radius: 0px 0px 12px 12px;"
              class="detail-section inventory-check"
            >
              <h3 style="margin-bottom: 10px;">Inventory Check</h3>
              <div class="availability-container">
                <input
                  type="number"
                  [(ngModel)]="checkQuantity"
                  placeholder="Check quantity"
                  min="1"
                  class="availability-input"
                />
                <button
                  style="cursor: pointer;"
                  (click)="checkAvailability()"
                  class="availability-btn"
                  [disabled]="!checkQuantity"
                >
                  Check Availability
                </button>
                <div
                  *ngIf="availabilityResult !== null"
                  class="availability-result"
                  [ngClass]="{
                    'result-available': availabilityResult,
                    'result-unavailable': !availabilityResult
                  }"
                >
                  {{ availabilityResult ? 'Available' : 'Not Available' }}
                </div>
              </div>
            </div>
          </div>

          <div class="item-actions" *ngIf="isAdmin || isManager">
            <button
              style="cursor: pointer;"
              class="action-btn edit-btn"
              (click)="editItem()"
            >
              <span>Edit Item</span>
            </button>
            <button
              style="cursor: pointer;"
              class="action-btn delete-btn"
              (click)="deleteItem()"
            >
              <span>Delete Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .item-detail-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 2rem;
      }

      .item-detail-container {
        width: 100%;
        max-width: 900px;
      }

      .item-detail-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1),
          0 5px 15px rgba(0, 0, 0, 0.07);
        padding: 2.5rem;
        transition: all 0.3s ease;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 2px solid rgba(0, 0, 0, 0.05);
        padding-bottom: 1rem;
      }

      .item-title-section h2 {
        color: #2c3e50;
        margin: 0;
        font-size: 2rem;
        font-weight: 600;
      }

      .status-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9rem;
      }

      .item-tag {
        background-color: #ff6b00;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
      }

      .detail-section {
        background: #f9f9f9;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .vendor-detail {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .detail-icon {
        font-size: 2rem;
        opacity: 0.7;
      }

      .availability-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .availability-input {
        padding: 0.75rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .availability-input:focus {
        outline: none;
        border-color: #ff6b00;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
      }

      .availability-btn {
        background-color: #ff6b00;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .availability-btn:hover {
        background-color: #ff6b00;
      }

      .item-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }

      .action-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .edit-btn {
        background-color: #ff6b00;
        color: white;
      }

      .delete-btn {
        background-color: #e74c3c;
        color: white;
      }

      .action-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
          0 3px 6px rgba(0, 0, 0, 0.08);
      }

      /* Stock and Availability Colors */
      .high-stock {
        background-color: rgba(46, 204, 64, 0.2);
        color: rgb(118, 170, 124);
      }

      .medium-stock {
        background-color: rgba(255, 165, 0, 0.2);
        color: #ffa500;
      }

      .low-stock {
        background-color: rgba(255, 65, 54, 0.2);
        color: #ff4136;
      }
      .result-available {
        color: #2ecc71;
        font-weight: bold;
      }
      .result-unavailable {
        color: #e74c3c;
        font-weight: bold;
      }
    `,
  ],
})
export class ItemDetailComponent implements OnInit {
  item: Item | null = null;
  checkQuantity: number | null = null;
  availabilityResult: boolean | null = null;
  isAdmin: boolean = false;
  isManager: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadItemDetails(id);
    this.checkUserRole();
  }

  checkUserRole(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'ADMIN';
    this.isManager = role === 'MANAGER';
  }

  loadItemDetails(id: number): void {
    this.itemService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
      },
      error: (err) => {
        console.error('Error loading item details', err);
        this.router.navigate(['/items']);
      },
    });
  }

  checkAvailability(): void {
    if (this.item && this.checkQuantity) {
      this.itemService
        .checkItemAvailability(this.item.name, this.checkQuantity)
        .subscribe({
          next: (result) => {
            this.availabilityResult = result;
          },
          error: (err) => {
            console.error('Error checking availability', err);
          },
        });
    }
  }

  editItem(): void {
    if (this.item && (this.isAdmin || this.isManager)) {
      this.router.navigate(['/update-item', this.item.id]);
    }
  }

  deleteItem(): void {
    if (confirm('Are you sure you want to delete this item?')) {
      if (this.item && (this.isAdmin || this.isManager)) {
        this.itemService.deleteItem(this.item.id!).subscribe({
          next: () => {
            this.router.navigate(['/items']);
          },
          error: (err) => {
            console.error('Error deleting item', err);
          },
        });
      }
    }
  }
}
