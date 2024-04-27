import { Component, OnInit } from '@angular/core';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit{
  orders: Order[] = [];
  private hubConnection : any;
  private updateInterval: any;

  constructor(private orderService: OrdersService){}

  ngOnInit(): void {
    this.orderService.getAllStocks()
    .subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (response) => {
        console.log(response)
      }
    });
  }


}