import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {
    // Initialize currentUserSubject from localStorage
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
  }

  // Login method
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      map(user => {
        // Store user details in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(null as any);
      })
    );
  }

  // Logout method
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get user roles
  getUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }
  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.getUserRole().includes(role.toUpperCase()); // Ensure case matching
  }

  // Register new user
  register(user: Omit<User, 'id' | 'role'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  // Password reset request
  requestPasswordReset(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/reset-password`, { email });
  }

  // Observable for current user
  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}