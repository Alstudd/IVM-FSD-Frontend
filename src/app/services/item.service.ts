import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id?: number;
  name: string;
  quantityAvailable: number;
  category: string;
  vendorName?: string;
  vendorContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://localhost:8080/api/items';

  constructor(private http: HttpClient) {}

  // Fetch all items
  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  // Get item by ID
  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  // Get item by name
  getItemByName(name: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/name/${name}`);
  }

  // Add new item
  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  // Update existing item
  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${item.id}`, item);
  }

  // Delete item
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get items by category
  getItemsByCategory(category: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/category/${category}`);
  }

  // Get low stock items
  getLowStockItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/low-stock`);
  }

  // Get all unique categories
  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  // Get category counts
  getItemCategoryCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      `${this.apiUrl}/category-counts`
    );
  }

  // Check item availability
  checkItemAvailability(
    itemName: string,
    quantity: number
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('itemName', itemName)
      .set('quantity', quantity.toString());

    return this.http.post<boolean>(`${this.apiUrl}/check-availability`, null, {
      params,
    });
  }

  // Optional: Update item quantity (based on backend method)
  updateItemQuantity(
    itemName: string,
    quantityChange: number
  ): Observable<void> {
    const params = new HttpParams()
      .set('itemName', itemName)
      .set('quantityChange', quantityChange.toString());

    return this.http.post<void>(`${this.apiUrl}/update-quantity`, null, {
      params,
    });
  }
}
