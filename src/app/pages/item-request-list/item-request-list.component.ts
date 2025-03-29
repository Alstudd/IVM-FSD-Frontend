import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-item-request-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-request-list.component.html',
  styleUrls: ['./item-request-list.component.css'],
})
export class ItemRequestListComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  departments: string[] = ['IT', 'HR', 'Finance', 'Operations', 'Marketing'];
  statusCounts: { [key: string]: number } = {};
  totalRequestsCount: number = 0;
  isAdminOrManager: boolean = false;
  currentUserRole: string = '';
  currentUsername: string = '';

  // Filter options
  filterOptions = {
    status: '',
    department: '',
  };

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
    this.currentUserRole = this.authService.getUserRole();
    this.isAdminOrManager =
      this.currentUserRole === 'ADMIN' || this.currentUserRole === 'MANAGER';

    // Get the current username if role is USER
    if (this.currentUserRole === 'USER') {
      this.currentUsername = this.authService.getUserName();
    }
  }

  loadRequests(): void {
    if (this.currentUserRole === 'USER') {
      // If user role is USER, only load their own requests
      this.itemRequestService
        .getRequestsByRequestor(this.currentUsername)
        .subscribe({
          next: (requests) => {
            this.requests = requests;
            this.filteredRequests = [...this.requests];
            this.applyFilters();
          },
          error: (err) => console.error('Error loading user requests', err),
        });
    } else {
      // For ADMIN and MANAGER, load all requests
      this.itemRequestService.getAllRequests().subscribe({
        next: (requests) => {
          this.requests = requests;
          this.filteredRequests = [...this.requests];
          this.applyFilters();
        },
        error: (err) => console.error('Error loading requests', err),
      });
    }
  }

  loadStatusCounts(): void {
    if (this.currentUserRole === 'USER') {
      // For USER role, you might want to calculate counts manually from their own requests
      // or create a new endpoint to get counts for a specific user
      this.itemRequestService.getAllRequests().subscribe({
        next: (requests) => {
          const userRequests = requests.filter(
            (req) => req.requestorName === this.currentUsername
          );
          const counts: { [key: string]: number } = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
          };

          userRequests.forEach((req) => {
            if (req.status && counts[req.status]) {
              if (req.status) {
                counts[req.status]++;
              }
            } else {
              if (req.status) {
                counts[req.status] = 1;
              }
            }
          });

          this.statusCounts = counts;
        },
        error: (err) =>
          console.error('Error calculating user status counts', err),
      });
    } else {
      // For ADMIN and MANAGER, get all status counts
      this.itemRequestService.getRequestStatusCounts().subscribe({
        next: (counts) => (this.statusCounts = counts),
        error: (err) => console.error('Error loading status counts', err),
      });
    }
  }

  loadTotalRequestsCount(): void {
    if (this.currentUserRole === 'USER') {
      // For USER role, count only their requests (can be set after loading the user's requests)
      this.itemRequestService
        .getRequestsByRequestor(this.currentUsername)
        .subscribe({
          next: (requests) => (this.totalRequestsCount = requests.length),
          error: (err) => console.error('Error counting user requests', err),
        });
    } else {
      // For ADMIN and MANAGER, get total count of all requests
      this.itemRequestService.getTotalRequestsCount().subscribe({
        next: (count) => (this.totalRequestsCount = count),
        error: (err) =>
          console.error('Error loading total requests count', err),
      });
    }
  }

  applyFilters(): void {
    this.filteredRequests = this.requests.filter((request) => {
      // Filter by status
      if (
        this.filterOptions.status &&
        request.status !== this.filterOptions.status
      ) {
        return false;
      }

      // Filter by department
      if (
        this.filterOptions.department &&
        request.department !== this.filterOptions.department
      ) {
        return false;
      }

      return true;
    });
  }

  filterByStatus(event: any): void {
    this.filterOptions.status = event.target.value;
    this.applyFilters();
  }

  filterByDepartment(event: any): void {
    this.filterOptions.department = event.target.value;
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterOptions = {
      status: '',
      department: '',
    };
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  deleteRequest(id: number): void {
    if (
      confirm(
        'Are you sure you want to delete this request?'
      )
    ) {
      this.itemRequestService.deleteRequest(id).subscribe({
        next: () => {
          this.filteredRequests = this.filteredRequests.filter(
            (request) => request.id !== id
          );
          this.loadStatusCounts();
        },
        error: (err) => {
          console.error('Error deleting request', err);
        },
      });
    }
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    alert(message);
  }

  approveRequest(id: number): void {
    this.itemRequestService.approveRequest(id).subscribe({
      next: (updatedRequest) => {
        this.loadRequests();
        this.loadStatusCounts();
        // Optional: show success message
        alert('Request approved successfully');
      },
      error: (err) => {
        console.error('Error approving request', err);
        // Show error message to the user
        alert(
          'Failed to approve request: ' +
            (err.error?.message || 'Insufficient inventory or item not found')
        );
      },
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
