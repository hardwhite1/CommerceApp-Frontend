import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { OrderItems } from '../models/order-items.model';
import { Orders } from '../models/orders.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersServiceService {

  constructor(private httpClient: HttpClient) { }

  getAllOrders(): Observable<Orders[]>
  {
      return this.httpClient.get<Orders[]>(`${environment.apiUrl}/Orders`);
  }

  getOrderById(id: number): Observable<Orders>
  {
    return this.httpClient.get<Orders>(`${environment.apiUrl}/Orders/${id}`);
  }

  createOrder(cartId: number): Observable<Orders>
  {
    return this.httpClient.post<Orders>(`${environment.apiUrl}/Orders`, { cartId })
  }

  cancelOrder(id: number): Observable<void>
  {
      return this.httpClient.delete<void>(`${environment.apiUrl}/Orders/${id}`);
  }
}
