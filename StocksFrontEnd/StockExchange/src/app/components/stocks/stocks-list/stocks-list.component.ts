import { Component, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../../../models/stock.model';
import { StocksService } from '../../../services/stocks.service';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-stocks-list',
  templateUrl: './stocks-list.component.html',
  styleUrl: './stocks-list.component.css'
})
export class StocksListComponent implements OnInit, OnDestroy {

  stocks: Stock[] = [];
  private hubConnection!: HubConnection;
  private updateInterval: any;

  constructor(private stocksService: StocksService, private http: HttpClient){}

  ngOnInit(): void {
    this.getInitialStocksData();
    this.connectToSignalR();
  }

  private getInitialStocksData() {
    this.stocksService.getAllStocks()
    .subscribe({
      next: (stocks) => {
        this.stocks = stocks;
      },
      error: (response) => {
        console.log(response)
      }
    });
  }

  private connectToSignalR() {
    this.hubConnection = new HubConnectionBuilder().withUrl("https://localhost:7015/stock-hub")
    .configureLogging(LogLevel.Information).build();

    this.hubConnection.on('ReceiveStockUpdate', (data: any) => {
      console.log(data);
      this.stocks = data;
      //this.stocks.push(data);
      
    });

    this.hubConnection.start().catch(error => console.error('Error establishing SignalR connection:', error));
    /*this.hubConnection.start()
      .then(() => this.hubConnection.invoke("StartStockUpdates"))
      .catch((err: Error) => console.error(err.toString()));*/
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.error(error));
    }
  }


}
