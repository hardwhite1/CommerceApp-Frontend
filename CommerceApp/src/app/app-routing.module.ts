import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WelcomePageComponent } from './welcome/welcome-page/welcome-page.component';
import { ProductsFormComponent } from './products/products-form/products-form.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartItemsComponent } from './cart/cart-items/cart-items.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { OrdersComponent } from './cart/orders/orders.component';
import { PaymentsComponent } from './payments/payments/payments.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'welcome', component: WelcomePageComponent
  },
  {
    path: 'products-form', component: ProductsFormComponent
  },
  {
    path: 'products-list', component: ProductsListComponent
  },
  {
    path: 'products-details', component: ProductDetailsComponent
  },
  {
    path: 'cart-items', component: CartItemsComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'my-orders', component: OrdersComponent
  },
  {
    path: 'payments', component: PaymentsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
