import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css'],
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ItemAddComponent implements OnInit {
  itemForm: FormGroup;
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
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.itemService.addItem(this.itemForm.value).subscribe({
        next: () => {
          // Show success message or toast
          this.router.navigate(['/items']);
        },
        error: (err) => {
          console.error('Error adding item', err);
          // Handle error (show error message)
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
