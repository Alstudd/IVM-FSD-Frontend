import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemRequest {
  id?: number;
  itemName: string;
  quantityRequired: number;
  purpose: string;
  department: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestorName: string;
  requestorContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = 'http://localhost:8080/api/requests';

  constructor(private http: HttpClient) {}

  // Fetch all requests
  getAllRequests(): Observable<ItemRequest[]> {
    return this.http.get<ItemRequest[]>(this.apiUrl);
  }

  // Get request by ID
  getRequestById(id: number): Observable<ItemRequest> {
    return this.http.get<ItemRequest>(`${this.apiUrl}/${id}`);
  }

  // Create new request
  createRequest(request: ItemRequest): Observable<ItemRequest> {
    return this.http.post<ItemRequest>(this.apiUrl, request);
  }

  // Update existing request
  updateRequest(id: number, request: ItemRequest): Observable<ItemRequest> {
    return this.http.put<ItemRequest>(`${this.apiUrl}/${id}`, request);
  }

  // Delete request
  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get requests by status
  getRequestsByStatus(status: string): Observable<ItemRequest[]> {
    return this.http.get<ItemRequest[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get requests by department
  getRequestsByDepartment(department: string): Observable<ItemRequest[]> {
    return this.http.get<ItemRequest[]>(
      `${this.apiUrl}/department/${department}`
    );
  }

  // Get requests by requestor name
  getRequestsByRequestor(name: string): Observable<ItemRequest[]> {
    return this.http.get<ItemRequest[]>(`${this.apiUrl}/requestor/${name}`);
  }

  // Approve request
  approveRequest(id: number): Observable<ItemRequest> {
    return this.http.post<ItemRequest>(`${this.apiUrl}/${id}/approve`, {});
  }

  // Reject request
  rejectRequest(id: number): Observable<ItemRequest> {
    return this.http.post<ItemRequest>(`${this.apiUrl}/${id}/reject`, {});
  }

  // Get status counts
  getRequestStatusCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/status-counts`
    );
  }

  // Get department counts
  getDepartmentCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/department-counts`
    );
  }

  // Get total requests count
  getTotalRequestsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Advanced filtering method
  filterRequests(filters: {
    status?: string;
    department?: string;
    requestorName?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<ItemRequest[]> {
    let params = new HttpParams();

    if (filters.status) params = params.set('status', filters.status);
    if (filters.department)
      params = params.set('department', filters.department);
    if (filters.requestorName)
      params = params.set('requestorName', filters.requestorName);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);

    return this.http.get<ItemRequest[]>(`${this.apiUrl}/filter`, { params });
  }

  // Export requests to CSV
  exportRequestsToCsv(filters?: any): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
      params: filters ? new HttpParams({ fromObject: filters }) : undefined,
    });
  }
}
