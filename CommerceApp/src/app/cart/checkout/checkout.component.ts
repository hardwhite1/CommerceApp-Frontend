import { Component, OnInit } from '@angular/core';
import { CartItems } from 'src/app/models/cart-items.model';
import { CartsServiceService } from 'src/app/services/carts-service.service';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItems[] = [];
  cartId: number | null = null
  shippingFee = 200;
  paymentMethod = 'mpesa';
  isCheckingOut = false;
  shippingForm!: FormGroup;

  constructor(
    private cartsService: CartsServiceService, 
    private route: ActivatedRoute,
    private fb: FormBuilder, 
    private router: Router) 
    { }

  get cartQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  ngOnInit(): void {

    //Initialize the shipping form with form controls and validators
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phoneNumber: ['', Validators.maxLength(15), Validators.pattern(/^\+?\d{10,15}$/), Validators.required, Validators.minLength(10)],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zipCode: [''],
      pickUpLocation: ['', Validators.required]
    });

    const cartId = Number(this.route.snapshot.paramMap.get('cartId'));

    if(Number.isSafeInteger(cartId) && cartId > 0)
    {
      this.cartId = cartId;
      this.loadCartItems();
    }
  }

  //load cartItems
  loadCartItems(): void
  {
      if(this.cartId == null)
      {
        return;
      }
      this.cartsService.getCartItems(this.cartId).subscribe({
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

  //Calculate sub-total
  get subTotal(): number
  {
    return this.cartItems.reduce((total, item) =>
      total + (item.price * item.quantity), 0
    );
  }

  //calculate grand-total
  get grandTotal(): number
  {
    return this.subTotal + this.shippingFee;
  }

  //increase quantity
  increaseQuantity(item: CartItems): void
  {
    if(this.cartId == null) return;

    this.cartsService.AddItemsToCart(this.cartId, item.productId, 1).subscribe({
      next: () => this.loadCartItems(),
      error: (err) => console.error(err)
    });
  }

  //Decrease quantity
  decreaseQuantity(item: CartItems): void
  {
    if(item.quantity <= 1 || this.cartId == null) return;
    this.cartsService.UpdateCart(this.cartId, item.productId, item.quantity - 1).subscribe({
      next: () => this.loadCartItems(),
      error: (err) => console.error(err)
    });
  }
  

  //Remove item
  removeItem(item: CartItems): void
  {
    if(this.cartId == null) return;

    this.cartsService.RemoveItemFromCart(this.cartId, item.productId).subscribe({
      next: () => this.loadCartItems(),
      error: (err) => console.error(err)
    });
  }

  //select payment method
  selectPaymentMethod(method: string): void
  {
    this.paymentMethod = method;
  }

  //checkout
  checkout(): void
  {
    if(this.shippingForm.invalid || this.cartItems.length === 0)
    {
      return this.shippingForm.markAllAsTouched();
    }

      const orderData = 
      {
        cartId: this.cartId,
        shippingInformation: this.shippingForm.value,
        paymentMethod: this.paymentMethod,
        totalAmount: this.grandTotal
      };

      console.log('checkout data', orderData)

      //Todo, sent orderData to your backend
  }

  

}
