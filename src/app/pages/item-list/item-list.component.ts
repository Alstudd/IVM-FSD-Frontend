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
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
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
    if (confirm('Are you sure you want to delete this item?')) {
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
}
