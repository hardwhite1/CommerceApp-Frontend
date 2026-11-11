import { Component, OnInit } from '@angular/core';
import { CartItems } from 'src/app/models/cart-items.model';
import { CartsServiceService } from 'src/app/services/carts-service.service';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItems[] = []
  //cartId: number | null = null

  constructor(private cartsService: CartsServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const cartId = Number(this.route.snapshot.paramMap.get('cartId'));

    this.cartsService.getCartItems(cartId).subscribe({
      next: (items) =>{
        this.cartItems = items;
      },
      error: err => {
        console.error(err)
      },
      complete: () => {
        console.log("Cart items fetched", this.cartItems)
      }
    });
  }

  // getCartItems(): void
  // {
  //   return this.cartsService.getCartItems(this.cartId).subscribe({

  //   });
  // }

}
