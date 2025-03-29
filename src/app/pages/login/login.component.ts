import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in and user is Admin or Manager then dashboard else item-requests
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER')) {
        this.router.navigate(['/dashboard']);
      } else if (currentUser && currentUser.role === 'USER') {
        this.router.navigate(['/item-requests']);
      }
    } 
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginError = false;

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          // Redirect based on user role
          const role = user.role;
          if (role == 'ADMIN' || role == 'MANAGER') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/item-requests']);
          }
        } else {
          this.loginError = true;
        }
      },
      error: () => {
        this.isLoading = false;
        this.loginError = true;
      },
    });
  }

  // Convenience getters for easy access in template
  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
