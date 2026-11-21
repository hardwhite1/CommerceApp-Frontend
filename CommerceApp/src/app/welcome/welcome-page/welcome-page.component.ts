
import { Component, OnInit } from '@angular/core';
import { CartsServiceService } from 'src/app/services/carts-service.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
[x: string]: any;

  cartItemCount = 0;

  constructor(
    private cartsService: CartsServiceService
  ) { }

  ngOnInit(): void {
    const cartId = localStorage.getItem('commerceApp.cartId');

    if (cartId) {
      this.cartsService.getCartById(Number(cartId)).subscribe({
        next: (cart: any) => {
          this.cartItemCount = cart.cartItems?.reduce(
            (total: number, item: any) => total + item.quantity,
            0
          ) ?? 0;
        },
        error: (error) => {
          console.error('Unable to retrieve cart:', error);
        }
      });
    }
  }
}
