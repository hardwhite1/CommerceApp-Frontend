import { Component, OnInit } from '@angular/core';
import { CartItems } from 'src/app/models/cart-items.model';
import { Products } from 'src/app/models/products.model';
import { CartsServiceService } from 'src/app/services/carts-service.service';
import { ProductsServiceService } from 'src/app/services/products-service.service';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: Products[] = [];
  cartItems: CartItems[] = [];

  private readonly cartStorageKey = 'commerceApp.cartId';

  constructor(
    private productsService: ProductsServiceService,
    private cartsService: CartsServiceService
  ) { }

  get cartQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  ngOnInit(): void {
    const cartId = Number(localStorage.getItem(this.cartStorageKey));
    if (Number.isSafeInteger(cartId) && cartId > 0) {
      this.cartsService.getCartItems(cartId).subscribe({
        next: items => {
          this.cartItems = items ?? [];
        },
        error: err => {
          console.error(err);
        }
      });
    }

    this.productsService.getAllProducts().subscribe({
      next: (records) => {
        this.products = records;
      },
      error: err => {
        console.error(err)
      },
      complete: () =>{
        console.log("Request processed successfuly", this.products)
      }
    })
  }

}
