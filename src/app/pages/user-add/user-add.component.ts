import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  userForm: FormGroup;
  departments: string[] = [];
  roles: string[] = ['ADMIN', 'MANAGER', 'USER'];
  isSubmitting = false;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        department: ['', Validators.required],
        role: ['USER', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    // Check user permissions - only admin can add users
    const userRole = this.authService.getUserRole();
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      this.router.navigate(['/']);
    }

    // Load departments
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.userService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Error loading departments', err);
      },
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.formError = '';

    if (this.userForm.valid) {
      this.isSubmitting = true;

      // Remove confirmPassword field before submission
      const userData = { ...this.userForm.value };
      delete userData.confirmPassword;

      this.userService.addUser(userData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error adding user', err);
          this.formError =
            err.error?.message || 'Failed to add user. Please try again.';
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  // Convenience getters for form controls
  get name() {
    return this.userForm.get('name');
  }
  get username() {
    return this.userForm.get('username');
  }
  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  get department() {
    return this.userForm.get('department');
  }
  get role() {
    return this.userForm.get('role');
  }
}
