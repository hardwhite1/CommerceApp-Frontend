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

  products: Products[] = [];

  constructor(private route: ActivatedRoute, private productsService: ProductsServiceService) { }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("Products received", this.products)
      },
      error: (err) =>{
        console.error("An error has occured", err)
      }

    });
  }

}
