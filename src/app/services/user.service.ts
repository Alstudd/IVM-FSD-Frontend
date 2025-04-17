import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  password?: string; // Optional for updates and listing
  name: string;
  department: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://inventory-management-backend-1-mdjq.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Get user by username
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  // Add new user
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update existing user
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  // Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get users by role
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  // Get users by department
  getUsersByDepartment(department: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/department/${department}`);
  }

  // Check if user has admin access
  hasAdminAccess(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-admin/${username}`);
  }

  // Check if user has manager access
  hasManagerAccess(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-manager/${username}`);
  }

  // Get all departments (unique list)
  getAllDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/departments`);
  }

  // Get department user counts
  getDepartmentUserCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/department-counts`
    );
  }

  // Get role counts
  getRoleCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/role-counts`
    );
  }
}
