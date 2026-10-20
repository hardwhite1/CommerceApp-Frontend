import { Injectable } from '@angular/core';
import { Products } from '../models/products.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ProductsServiceService {

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<Products[]> 
  {
    return this.httpClient.get<Products[]>(`${environment.apiUrl}/Products`);
  }

  getProductById(id: number): Observable<Products>
  {
    return this.httpClient.get<Products>(`${environment.apiUrl}/Products/${id}`);
  }

  createProduct(products: Omit<Products, 'id'>):Observable<Products>
  {
    return this.httpClient.post<Products>(`${environment.apiUrl}/Products`, products);
  }

  updateProduct(id: number, products: Products): Observable<Products>
  {
    return this.httpClient.put<Products>(`${environment.apiUrl}/${id}`, products);
  }

  deleteProduct(id: number): Observable<void>
  {
    return this.httpClient.delete<void>(`${environment.apiUrl}/Product/${id}`);
  }
}
