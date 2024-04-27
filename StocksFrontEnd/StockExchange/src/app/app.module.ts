import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StocksListComponent } from './components/stocks/stocks-list/stocks-list.component';
//import { HttpClientModule } from '@angular/common/http';
import { ViewHistoryComponent } from './components/stocks/view-history/view-history.component';
import { DatePipe } from '@angular/common';


import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { JwtInterceptor } from './Interceptor/auth-interceptor.interceptor';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StocksListComponent,
    ViewHistoryComponent,
    PlaceOrderComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    CommonModule
  ],
  providers: [
    DatePipe,
    provideClientHydration(),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
