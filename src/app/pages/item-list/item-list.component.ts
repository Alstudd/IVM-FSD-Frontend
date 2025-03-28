import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemService, Item } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-dashboard">
      <div class="dashboard-header">
        <h1 style="color: #ff6b00;">Inventory Items</h1>
        <div class="header-actions">
          <div class="search-container">
            <input
              type="text"
              placeholder="Search items..."
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              class="search-input"
            />
            <i class="search-icon">🔍</i>
          </div>
          <button *ngIf="isAdmin || isManager" class="add-item-button" (click)="addNewItem()">
            + Add New Item
          </button>
        </div>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <select
            [(ngModel)]="selectedCategory"
            (change)="applyFilters()"
            class="category-filter"
          >
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </option>
          </select>

          <div class="stock-toggle">
            <input
              type="checkbox"
              id="lowStockToggle"
              [(ngModel)]="lowStockFilter"
              (change)="applyFilters()"
            />
            <label for="lowStockToggle">Low Stock Only</label>
          </div>
        </div>

        <div class="category-stats">
          <div
            *ngFor="let stat of categoryCounts | keyvalue"
            class="stat-badge"
          >
            {{ stat.key }}: {{ stat.value }}
          </div>
        </div>
      </div>

      <div class="items-grid">
        <div
          *ngFor="let item of filteredItems"
          class="item-card"
          (click)="viewItemDetails(item)"
        >
          <div class="item-card-header">
            <h3>{{ item.name }}</h3>
            <span
              class="stock-indicator"
              [ngClass]="{
                'high-stock': item.quantityAvailable >= 20,
                'medium-stock':
                  item.quantityAvailable >= 10 && item.quantityAvailable < 20,
                'low-stock': item.quantityAvailable < 10
              }"
            >
              {{ item.quantityAvailable }} in Stock
            </span>
          </div>

          <div class="item-card-body">
            <div class="item-detail">
              <span class="label">Category</span>
              <span class="value">{{ item.category }}</span>
            </div>
            <div class="item-detail">
              <span class="label">Vendor</span>
              <span class="value">{{ item.vendorName || 'N/A' }}</span>
            </div>
          </div>

          <div class="item-card-footer">
            <div class="action-buttons">
              <button
                *ngIf="isAdmin || isManager"
                class="edit-btn"
                (click)="editItem(item)"
              >
                Edit
              </button>
              <button
                *ngIf="isAdmin || isManager"
                class="delete-btn"
                (click)="deleteItem(item.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .inventory-dashboard {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        background-color: white;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        color: #ff6b00;
        font-size: 2.5rem;
        margin: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .search-container {
        position: relative;
      }

      .search-input {
        padding: 0.65rem 2rem;
        border: 2px solid #ddd;
        border-radius: 4px;
        width: 250px;
        // font-size: 1rem;
        transition: all 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        border-color: #ff6b00;
      }

      .search-icon {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--primary-color);
      }

      .add-item-button {
        background-color: #ff6b00;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .add-item-button:hover {
        background-color: #4cae4c;
      }

      .filters-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background-color: white;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .filter-group {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .category-filter {
        padding: 0.5rem 1rem;
        border: 2px solid #ddd;
        border-radius: 4px;
      }

      .category-filter:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        border-color: #ff6b00;
      }

      .stock-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .category-stats {
        display: flex;
        gap: 1rem;
      }

      .stat-badge {
        background-color: #ff6b00;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .item-card {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .item-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      }

      .item-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .item-card-header h3 {
        margin: 0;
        color: #ff6b00;
        font-size: 1.25rem;
      }

      .stock-indicator {
        font-weight: bold;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }

      .high-stock {
        background-color: rgba(46, 204, 64, 0.2);
        color: #2ecc40;
      }

      .medium-stock {
        background-color: rgba(255, 165, 0, 0.2);
        color: #ffa500;
      }

      .low-stock {
        background-color: rgba(255, 65, 54, 0.2);
        color: #ff4136;
      }

      .item-card-body {
        flex-grow: 1;
        margin-bottom: 1rem;
      }

      .item-detail {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .item-detail .label {
        color: #666;
        font-weight: 500;
      }

      .item-detail .value {
        color: #333;
      }

      .item-card-footer {
        display: flex;
        justify-content: space-between;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
        width: 100%;
      }

      .edit-btn,
      .delete-btn {
        flex-grow: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.3s ease;
      }

      .edit-btn {
        background-color: #ff6b00;
        color: white;
      }

      .delete-btn {
        background-color: #d32f2f;
        color: white;
      }

      .edit-btn:hover,
      .delete-btn:hover {
        opacity: 0.8;
      }
    `,
  ],
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  categories: string[] = [];
  categoryCounts: { [key: string]: number } = {};

  selectedCategory: string = '';
  lowStockFilter: boolean = false;
  searchTerm: string = '';

  filteredItems: Item[] = [];

  isAdmin: boolean = false;
  isManager: boolean = false;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
    this.loadCategoryCounts();
    this.checkUserRole();
  }

  checkUserRole(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'ADMIN';
    this.isManager = role === 'MANAGER';
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.items = items;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading items', err);
      },
    });
  }

  loadCategories(): void {
    this.itemService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      },
    });
  }

  loadCategoryCounts(): void {
    this.itemService.getItemCategoryCounts().subscribe({
      next: (counts) => {
        this.categoryCounts = counts;
      },
      error: (err) => {
        console.error('Error loading category counts', err);
      },
    });
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter((item) => {
      const categoryMatch =
        !this.selectedCategory || item.category === this.selectedCategory;
      const lowStockMatch = !this.lowStockFilter || item.quantityAvailable < 10;
      const searchMatch =
        !this.searchTerm ||
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase());

      return categoryMatch && lowStockMatch && searchMatch;
    });
  }

  viewItemDetails(item: Item): void {
    if (item.id) {
      this.router.navigate(['/item-detail', item.id]);
    }
  }

  addNewItem(): void {
    if (this.isAdmin || this.isManager) {
      this.router.navigate(['/add-item']);
    }
  }

  editItem(item: Item): void {
    if (this.isAdmin || this.isManager) {
      this.router.navigate(['/update-item', item.id]);
    }
  }

  deleteItem(id: any): void {
    if ((this.isAdmin || this.isManager) && id !== undefined) {
      this.itemService.deleteItem(id).subscribe({
        next: () => {
          this.items = this.items.filter((item) => item.id !== id);
        },
        error: (err) => {
          console.error('Error deleting item', err);
        },
      });
    }
  }
}
