import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  departments: string[] = [];
  roles: string[] = ['ADMIN', 'MANAGER', 'USER'];
  isSubmitting = false;
  formError = '';
  userId: number = 0;
  user: User | null = null;
  changePassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: [{ value: '', disabled: true }],
      confirmPassword: [{ value: '', disabled: true }],
      department: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Check user permissions
    const userRole = this.authService.getUserRole();
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      this.router.navigate(['/']);
      return;
    }

    // Load departments
    this.loadDepartments();

    // Get user ID from route params
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = id;

    if (id) {
      this.loadUserDetails(id);
    } else {
      this.router.navigate(['/users']);
    }
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

  loadUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          department: user.department,
          role: user.role,
        });
      },
      error: (err) => {
        console.error('Error loading user details', err);
        this.formError = 'User not found or cannot be loaded';
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 3000);
      },
    });
  }

  togglePasswordChange(): void {
    this.changePassword = !this.changePassword;

    if (this.changePassword) {
      this.userForm.get('password')?.enable();
      this.userForm.get('confirmPassword')?.enable();
      this.userForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm
        .get('confirmPassword')
        ?.setValidators([Validators.required]);
    } else {
      this.userForm.get('password')?.disable();
      this.userForm.get('confirmPassword')?.disable();
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.setValue('');
      this.userForm.get('confirmPassword')?.setValue('');
    }

    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  checkPasswordsMatch(): boolean {
    if (!this.changePassword) return true;

    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;

    return password === confirmPassword;
  }

  onSubmit(): void {
    this.formError = '';

    if (!this.checkPasswordsMatch()) {
      this.formError = 'Passwords do not match';
      return;
    }

    if (this.userForm.valid) {
      this.isSubmitting = true;

      // Prepare user data for update
      const userData: User = {
        id: this.userId,
        name: this.userForm.get('name')?.value,
        username: this.userForm.get('username')?.value,
        department: this.userForm.get('department')?.value,
        role: this.userForm.get('role')?.value,
      };

      // Only include password if it's being changed
      if (this.changePassword) {
        userData.password = this.userForm.get('password')?.value;
      }

      this.userService.updateUser(userData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error updating user', err);
          this.formError =
            err.error?.message || 'Failed to update user. Please try again.';
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control?.enabled) {
          control.markAsTouched();
        }
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
