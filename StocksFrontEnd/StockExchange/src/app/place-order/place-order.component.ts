import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { NotificationService } from '../Notification/notification.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent {

  OrderForm : FormGroup;

  constructor (private formbuilder: FormBuilder  , private http: HttpClient, private router : Router, private  notify : NotificationService) {

    this.OrderForm = this.formbuilder.group({
      symbol : '',
      orderType : '',
      quantity : '',
    })    
  }

  add() : void {

    debugger
    if (this.OrderForm.value.symbol === '' || this.OrderForm.value.orderType === '' ){
      this.notify.showSuccess('Please fill the spaces');
    }
    if (this.OrderForm.value.quantity <= 0 ){
      this.notify.showSuccess('Please enter valid quantity');
    }
    if (this.OrderForm.value.orderType === 'sell'){
      this.Addorder(this.OrderForm.value.symbol, 1 , this.OrderForm.value.quantity).subscribe ();
    }
    if (this.OrderForm.value.orderType === 'buy'){
      this.Addorder(this.OrderForm.value.symbol, 2 , this.OrderForm.value.quantity).subscribe ();
    }
    return;
  }

  Addorder (symbol: string, type: number, quantity : number) : Observable<any> 
  {
    debugger
    return this.http.post<any>(`https://localhost:7015/API/orders`, { symbol, type, quantity })
    .pipe(
      tap(response => {
        console.log(response);
        this.notify.showSuccess('Order Placed Successfully');
        this.router.navigate(['/home'] );

      }),
      catchError(error => {
        if (error.status === 404)  {
          this.notify.showSuccess('Stock not found.');
        }
        return throwError(error);
      })
    );
  }
}
