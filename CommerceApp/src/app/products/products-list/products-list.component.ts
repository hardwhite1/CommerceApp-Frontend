import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products.model';
import { ProductsServiceService } from 'src/app/services/products-service.service';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: Products[] = [];

  constructor(private productsService: ProductsServiceService) { }

  ngOnInit(): void {
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
