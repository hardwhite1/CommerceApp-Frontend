import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Console, error } from 'console';
import { Products } from 'src/app/models/products.model';
import { ProductsServiceService } from 'src/app/services/products-service.service';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.css']
})
export class ProductsFormComponent implements OnInit {

  formGroup: FormGroup;
  editingId: number | null = null;

  constructor(
    private productsService: ProductsServiceService, 
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) 
  {
    this.formGroup = fb.group({
      name: ['', Validators.required],
      description: ['', [
        Validators.required,
        Validators.maxLength(40)
      ]],
      brand: ['', Validators.required],
      price: [0, [
        Validators.required,
        Validators.min(0.1)
      ]],
      originalPrice: [0, [
        Validators.required,
        Validators.min(0.1)
      ]],
      stockQuantity: [0, [
        Validators.required,
        Validators.min(0.1)
      ]],
      pictureUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id)
    {
      return;
    }

    this.editingId =+ id; //convert id from string to int
    this.productsService.getProductById(this.editingId).subscribe({
      next: (product) => {
        this.formGroup.patchValue(product);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onSubmit(): void
  {
    if(this.formGroup.invalid)
    {
      return;
    }

    var product = this.formGroup.value;

    var request = this.editingId ? this.productsService.updateProduct(this.editingId, {
      id: this.editingId,
      ...product
    })
    : this.productsService.createProduct(product);

    request.subscribe({
      next: () => {
        this.router.navigate(['/products-list'])
      },
      error: err => {
        console.error(err)
      },
      complete: () => {
        console.log("request processed successfuly", product)
      }
    });
  }

}
