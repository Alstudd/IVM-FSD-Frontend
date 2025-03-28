import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService, Item } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-item-update',
  templateUrl: './item-update.component.html',
  styleUrls: ['./item-update.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ItemUpdateComponent implements OnInit {
  itemForm: FormGroup;
  itemId: number | null = null;
  categories: string[] = [
    'Electronics',
    'Office Supplies',
    'Furniture',
    'Software',
    'Hardware',
  ];

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantityAvailable: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      vendorName: [''],
      vendorContact: [''],
    });
  }

  ngOnInit(): void {
    // Check user permissions
    const userRole = this.authService.getUserRole();
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      this.router.navigate(['/']);
      return;
    }

    // Get item ID from route
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.itemId = +id;
        this.loadItem();
      }
    });
  }

  loadItem(): void {
    if (this.itemId) {
      this.itemService.getItemById(this.itemId).subscribe({
        next: (item) => {
          this.itemForm.patchValue(item);
        },
        error: (err) => {
          console.error('Error loading item', err);
          this.router.navigate(['/items']);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid && this.itemId) {
      const updatedItem: Item = {
        id: this.itemId,
        ...this.itemForm.value,
      };

      this.itemService.updateItem(updatedItem).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          console.error('Error updating item', err);
        },
      });
    }
  }

  // Convenience getters for form controls
  get name() {
    return this.itemForm.get('name');
  }
  get quantityAvailable() {
    return this.itemForm.get('quantityAvailable');
  }
  get category() {
    return this.itemForm.get('category');
  }
}
