import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from 'src/app/models/products.model';
import { ProductsServiceService } from 'src/app/services/products-service.service';
import { CartsServiceService } from 'src/app/services/carts-service.service';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItems } from 'src/app/models/cart-items.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Products | null = null;
  cartId: number | null = null;
  quantity: number = 1;
  isAddingToCart = false;
  cartItems: CartItems[] = [];

  private readonly cartStorageKey = 'commerceApp.cartId';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsServiceService,
    private cartsService: CartsServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  get cartQuantityForCurrentProduct(): number {
    const product = this.product;
    if (!product) {
      return 0;
    }

    return this.cartItems
      .filter(item => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0);
  }

  get availableStock(): number {
    if (!this.product) {
      return 0;
    }

    return Math.max(0, this.product.stockQuantity - this.cartQuantityForCurrentProduct);
  }

  ngOnInit(): void {
    const storedCartId = Number(localStorage.getItem(this.cartStorageKey));
    if (Number.isSafeInteger(storedCartId) && storedCartId > 0) {
      this.cartId = storedCartId;
      this.loadCartItems();
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || !Number.isFinite(id) || id <= 0) {
      this.router.navigate(['/products-list']);
      return;
    }

    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data ?? null;

        if (!this.product) {
          this.snackBar.open('Product not found.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/products-list']);
          return;
        }

        this.quantity = Math.min(this.quantity, this.availableStock || 1);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Unable to load this product right now.', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/products-list']);
      },
      complete: () => {
        console.log("Product fetched", this.product);
      }
    });
  }

  loadCartItems(): void {
    if (this.cartId === null) {
      this.cartItems = [];
      return;
    }

    this.cartsService.getCartItems(this.cartId).subscribe({
      next: (items) => {
        this.cartItems = items ?? [];

        if (this.product) {
          this.quantity = Math.min(this.quantity, this.availableStock || 1);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  deleteProduct(): void
  {
    if(!this.product)
    {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${this.product.name}?`);

    if(!confirmed)
    {
      return;
    }

    this.productsService.deleteProduct(this.product.id).subscribe({
      next: () =>{
        alert('Product deleted successfuly');
        this.router.navigate(['/products-list']);
      },
      error: err =>{
        console.error(err);
      }
    });
  }

  addItemToCart(): void
  {
    if (!this.product || this.isAddingToCart)
    {
      return;
    }

    const normalizedQuantity = Number.isFinite(this.quantity) ? Math.trunc(this.quantity) : 0;
    const availableQuantity = this.availableStock;

    if (normalizedQuantity < 1 || normalizedQuantity > availableQuantity) {
      this.snackBar.open('Please select a valid quantity for this product.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    const product = this.product;
    const cartId$ = this.cartId === null
      ? this.cartsService.createCart().pipe(
          tap(cart => {
            this.cartId = cart.id;
            localStorage.setItem(this.cartStorageKey, String(cart.id));
          }),
          map(cart => cart.id)
        )
      : of(this.cartId);

    this.isAddingToCart = true;
    cartId$.pipe(
      switchMap(cartId =>
        this.cartsService.AddItemsToCart(cartId, product.id, normalizedQuantity)
      ),
      finalize(() => this.isAddingToCart = false)
    ).subscribe({
      next: ()=>{
        this.snackBar.open('Product added to your cart successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['checkout/', this.cartId]);
      },
      error: err=>{
        console.error(err);
        this.snackBar.open('Unable to add this product to your cart. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

}
