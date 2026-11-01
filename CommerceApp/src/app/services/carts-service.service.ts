import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItems } from '../models/cart-items.model';
import { Carts } from '../models/carts.model';



@Injectable({
  providedIn: 'root'
})
export class CartsServiceService {

  constructor( private httpClient: HttpClient ) { }

  getAllCarts(): Observable<Carts[]>
  {
    return this.httpClient.get<Carts[]>(`${environment.apiUrl}/Carts`);
  }

  getCartById(id: number): Observable<Carts>
  {
    return this.httpClient.get<Carts>(`${environment.apiUrl}/Carts/${id}`);
  }

  AddItemsToCart(cartId: number, productId: number, quantity: number): Observable<Carts>
  {
    return this.httpClient.post<Carts>(`${environment.apiUrl}/Carts/${cartId}/items`,
      {productId, quantity}
    );
  }

  UpdateCart(cartId: number, productId: number, quantity: number): Observable<Carts>
  {
    return this.httpClient.put<Carts>(`${environment.apiUrl}/Carts/${cartId}items/${productId}`,
      {quantity}
    );
  }

  RemoveItemFromCart(cartId: number, productId: number): Observable<void>
  {
    return this.httpClient.delete<void>(`${environment.apiUrl}/carts/${cartId}/items/${productId}`,
      {
        params: {productId: productId}
      }
    );
  }

  ClearCart(cartId: number): Observable<void>
  {
      return this.httpClient.delete<void>(`${environment.apiUrl}/carts/${cartId}/items`);
  }
}
