import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [
    ReactiveFormsModule,
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
      username: ['', [
        Validators.required, 
        Validators.minLength(3)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginError = false;

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password })
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          if (user) {
            // Redirect based on user role
            const roles = user.roles || [];
            if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/request']);
            }
          } else {
            this.loginError = true;
          }
        },
        error: () => {
          this.isLoading = false;
          this.loginError = true;
        }
      });
  }

  // Convenience getters for easy access in template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}