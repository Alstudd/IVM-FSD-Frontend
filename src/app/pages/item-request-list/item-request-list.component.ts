import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-item-request-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="request-list-container">
      <div class="request-list-header">
        <h1>Item Requests</h1>
        <div class="header-actions">
          <button
            *ngIf="isAdminOrManager"
            class="action-btn create-btn"
            (click)="navigateToCreateRequest()"
          >
            Create New Request
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select (change)="filterByStatus($event)" class="filter-select">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by Department:</label>
          <select (change)="filterByDepartment($event)" class="filter-select">
            <option value="">All Departments</option>
            <option *ngFor="let dept of departments" [value]="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>

      <div class="request-stats">
        <div class="stat-card">
          <h3>Total Requests</h3>
          <p class="stat-number">{{ totalRequestsCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Requests</h3>
          <p class="stat-number">{{ statusCounts['PENDING'] || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Approved Requests</h3>
          <p class="stat-number">{{ statusCounts['APPROVED'] || 0 }}</p>
        </div>
      </div>

      <div class="request-list">
        <div
          *ngFor="let request of filteredRequests"
          class="request-card"
          [ngClass]="getStatusClass(request.status)"
        >
          <div class="request-header">
            <h3>{{ request.itemName }}</h3>
            <span class="status-badge">{{ request.status }}</span>
          </div>
          <div class="request-details">
            <p><strong>Quantity:</strong> {{ request.quantityRequired }}</p>
            <p><strong>Department:</strong> {{ request.department }}</p>
            <p><strong>Purpose:</strong> {{ request.purpose }}</p>
            <p><strong>Requestor:</strong> {{ request.requestorName }}</p>
          </div>
          <div class="request-actions" *ngIf="isAdminOrManager">
            <button
              *ngIf="request.status === 'PENDING'"
              class="action-btn approve-btn"
              (click)="approveRequest(request.id)"
            >
              Approve
            </button>
            <button
              *ngIf="request.status === 'PENDING'"
              class="action-btn reject-btn"
              (click)="rejectRequest(request.id)"
            >
              Reject
            </button>
            <button
              class="action-btn edit-btn"
              (click)="navigateToEditRequest(request.id)"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .request-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: linear-gradient(135deg, #fff5e6, #ffebd2);
      }

      .request-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 2px solid rgba(255, 107, 0, 0.2);
        padding-bottom: 1rem;
      }

      .request-list-header h1 {
        color: #ff6b00;
        margin: 0;
      }

      .filter-section {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .filter-select {
        padding: 0.5rem;
        border: 1px solid #ff6b00;
        border-radius: 4px;
      }

      .request-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        flex: 1;
        text-align: center;
      }

      .stat-number {
        color: #ff6b00;
        font-size: 2rem;
        font-weight: bold;
      }

      .request-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .request-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .request-card:hover {
        transform: translateY(-5px);
      }

      .request-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 0.5rem;
      }

      .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .request-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .create-btn {
        background-color: #ff6b00;
        color: white;
      }
      .approve-btn {
        background-color: #2ecc71;
        color: white;
      }
      .reject-btn {
        background-color: #e74c3c;
        color: white;
      }
      .edit-btn {
        background-color: #ff6b00;
        color: white;
      }

      .status-PENDING {
        border-left: 5px solid #f39c12;
      }
      .status-APPROVED {
        border-left: 5px solid #2ecc71;
      }
      .status-REJECTED {
        border-left: 5px solid #e74c3c;
      }
    `,
  ],
})
export class ItemRequestListComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  departments: string[] = ['IT', 'HR', 'Finance', 'Operations', 'Marketing'];
  statusCounts: { [key: string]: number } = {};
  totalRequestsCount: number = 0;
  isAdminOrManager: boolean = false;

  constructor(
    private itemRequestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadRequests();
    this.loadStatusCounts();
    this.loadTotalRequestsCount();
  }

  checkUserRole(): void {
    const role = this.authService.getUserRole();
    this.isAdminOrManager = role === 'ADMIN' || role === 'MANAGER';
  }

  loadRequests(): void {
    this.itemRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.filteredRequests = requests;
      },
      error: (err) => console.error('Error loading requests', err),
    });
  }

  loadStatusCounts(): void {
    this.itemRequestService.getRequestStatusCounts().subscribe({
      next: (counts) => (this.statusCounts = counts),
      error: (err) => console.error('Error loading status counts', err),
    });
  }

  loadTotalRequestsCount(): void {
    this.itemRequestService.getTotalRequestsCount().subscribe({
      next: (count) => (this.totalRequestsCount = count),
      error: (err) => console.error('Error loading total requests count', err),
    });
  }

  filterByStatus(event: any): void {
    const status = event.target.value;
    this.filteredRequests = status
      ? this.requests.filter((req) => req.status === status)
      : this.requests;
  }

  filterByDepartment(event: any): void {
    const department = event.target.value;
    this.filteredRequests = department
      ? this.requests.filter((req) => req.department === department)
      : this.requests;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  approveRequest(id: number): void {
    this.itemRequestService.approveRequest(id).subscribe({
      next: () => {
        this.loadRequests();
        this.loadStatusCounts();
      },
      error: (err) => console.error('Error approving request', err),
    });
  }

  rejectRequest(id: number): void {
    this.itemRequestService.rejectRequest(id).subscribe({
      next: () => {
        this.loadRequests();
        this.loadStatusCounts();
      },
      error: (err) => console.error('Error rejecting request', err),
    });
  }

  navigateToCreateRequest(): void {
    this.router.navigate(['/add-item-request']);
  }

  navigateToEditRequest(id: number): void {
    this.router.navigate([`/update-item-request/${id}`]);
  }
}
