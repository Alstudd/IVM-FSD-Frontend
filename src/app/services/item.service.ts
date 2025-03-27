import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id?: number;
  name: string;
  quantity: number;
  category: string;
  vendorDetails?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8080/api/items';

  constructor(private http: HttpClient) {}

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/`, item);
  }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/`);
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLowStockItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/low-stock`);
  }
}