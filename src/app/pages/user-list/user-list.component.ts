import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  departments: string[] = [];
  roles: string[] = ['ADMIN', 'MANAGER', 'USER'];

  // Filter options
  filterOptions = {
    name: '',
    username: '',
    department: '',
    role: '',
  };

  // Sorting
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // User role permissions
  isAdmin: boolean = false;
  isManager: boolean = false;

  // Stats
  roleCounts: { [key: string]: number } = {};
  departmentCounts: { [key: string]: number } = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadUsers();
    this.loadDepartments();
    this.loadStats();
  }

  checkUserRole(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'ADMIN';
    this.isManager = role === 'MANAGER';

    // Redirect if not authorized
    if (!this.isAdmin && !this.isManager) {
      // Redirect to home or dashboard
      this.router.navigate(['/']);
      return;
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading users', err);
      },
    });
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

  loadStats(): void {
    this.userService.getRoleCounts().subscribe({
      next: (data) => {
        this.roleCounts = data;
      },
      error: (err) => {
        console.error('Error loading role counts', err);
      },
    });

    this.userService.getDepartmentUserCounts().subscribe({
      next: (data) => {
        this.departmentCounts = data;
      },
      error: (err) => {
        console.error('Error loading department counts', err);
      },
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      // Filter by name
      if (
        this.filterOptions.name &&
        !user.name.toLowerCase().includes(this.filterOptions.name.toLowerCase())
      ) {
        return false;
      }

      // Filter by username
      if (
        this.filterOptions.username &&
        !user.username
          .toLowerCase()
          .includes(this.filterOptions.username.toLowerCase())
      ) {
        return false;
      }

      // Filter by department
      if (
        this.filterOptions.department &&
        user.department !== this.filterOptions.department
      ) {
        return false;
      }

      // Filter by role
      if (this.filterOptions.role && user.role !== this.filterOptions.role) {
        return false;
      }

      return true;
    });

    // Apply sorting
    this.sortUsers();
  }

  sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      let valA = a[this.sortBy as keyof User] as string;
      let valB = b[this.sortBy as keyof User] as string;

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (this.sortDirection === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });
  }

  changeSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.sortUsers();
  }

  resetFilters(): void {
    this.filterOptions = {
      name: '',
      username: '',
      department: '',
      role: '',
    };
    this.applyFilters();
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.loadStats();
        },
        error: (err) => {
          console.error('Error deleting user', err);
        },
      });
    }
  }

  getUserRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'role-admin';
      case 'MANAGER':
        return 'role-manager';
      default:
        return 'role-user';
    }
  }
}
