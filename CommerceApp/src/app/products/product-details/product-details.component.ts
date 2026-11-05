import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { Products } from 'src/app/models/products.model';
import { ProductsServiceService } from 'src/app/services/products-service.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product?: Products;

  constructor(private route: ActivatedRoute, private productsService: ProductsServiceService) { }

  ngOnInit(): void {

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

}
