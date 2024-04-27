import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { StocksListComponent } from './components/stocks/stocks-list/stocks-list.component';
import { ViewHistoryComponent } from './components/stocks/view-history/view-history.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const routes: Routes = [

  {path : "", component : LoginComponent},
  {path : "register" , component : RegisterComponent,},
  {path : "addOrder" , component : PlaceOrderComponent,},
  { path: 'stocks', component: StocksListComponent},
  { path: 'orderHistory', component: OrderHistoryComponent},
  { path: 'stocks/history/:symbol', component: ViewHistoryComponent}

]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
