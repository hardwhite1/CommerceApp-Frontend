import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from 'src/app/models/products.model';
import { ProductsServiceService } from 'src/app/services/products-service.service';
import { CartsServiceService } from 'src/app/services/carts-service.service';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product?: Products;
  cartId: number | null = null;
  quantity: number = 1;
  isAddingToCart = false;

  private readonly cartStorageKey = 'commerceApp.cartId';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsServiceService,
    private cartsService: CartsServiceService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const storedCartId = Number(localStorage.getItem(this.cartStorageKey));
    if (Number.isSafeInteger(storedCartId) && storedCartId > 0) {
      this.cartId = storedCartId;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: err => {
        console.error(err)
      },
      complete: () => {
        console.log("Product fetched", this.product)
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
        this.cartsService.AddItemsToCart(cartId, product.id, this.quantity)
      ),
      finalize(() => this.isAddingToCart = false)
    ).subscribe({
      next: ()=>{
        alert('Product successfully added to cart');
      },
      error: err=>{
        console.error(err);
        alert('Unable to add this product to your cart. Please try again.');
      }
    });
  }

}
