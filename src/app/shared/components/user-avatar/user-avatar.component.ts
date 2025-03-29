import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService, User } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ClickOutsideDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="user-avatar-container" (clickOutside)="isDropdownOpen = false">
      <div
        class="user-avatar"
        (click)="toggleDropdown()"
        [class.active]="isDropdownOpen"
      >
        <lu-user-circle [strokeWidth]="1.5" [size]="40" class="avatar-icon" />
        <div class="user-info">
          <span class="username">{{ username }}</span>
          <span class="user-role">{{ primaryRole }}</span>
        </div>
        <lu-chevron-down
          [strokeWidth]="1.5"
          [size]="20"
          class="dropdown-icon"
          [class.rotated]="isDropdownOpen"
        />
      </div>

      <div class="user-dropdown" *ngIf="isDropdownOpen">
        <div class="dropdown-item">
          <lu-user class="dropdown-icon" [size]="18" />
          <span>{{ name }}</span>
        </div>
        <div class="dropdown-item">
          <lu-settings class="dropdown-icon" [size]="18" />
          <span>{{ department }}</span>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item logout" (click)="logout()">
          <lu-log-out class="dropdown-icon" [size]="18" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .user-avatar-container {
        position: relative;
      }

      .user-avatar {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: 30px;
        transition: all 0.3s ease;
        gap: 0.75rem;
      }

      .user-avatar:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .user-avatar.active {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .avatar-icon {
        color: var(--text-light);
      }

      .user-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }

      .username {
        font-weight: 600;
        color: var(--text-light);
      }

      .user-role {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.7);
        text-transform: capitalize;
      }

      .dropdown-icon {
        color: var(--text-light);
        transition: transform 0.3s ease;
      }

      .dropdown-icon.rotated {
        transform: rotate(180deg);
      }

      .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        width: 250px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        margin-top: 0.5rem;
        z-index: 1000;
        overflow: hidden;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .dropdown-item:hover {
        background-color: #f4f4f4;
      }

      .dropdown-item .dropdown-icon {
        color: #666;
      }

      .dropdown-divider {
        height: 1px;
        background-color: #e0e0e0;
      }

      .dropdown-item.logout {
        color: #ff4500;
      }

      .dropdown-item.logout .dropdown-icon {
        color: #ff4500;
      }
    `,
  ],
})
export class UserAvatarComponent implements OnInit {
  isDropdownOpen = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  get name(): string {
    return this.currentUser?.name || 'User';
  }

  get department(): string {
    return this.currentUser?.department || 'N/A';
  }

  get username(): string {
    return this.currentUser?.username || 'User';
  }

  get primaryRole(): string {
    const role = this.currentUser?.role || null;
    return role ? role.toLowerCase() : 'guest';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }
}
