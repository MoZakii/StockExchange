import { Component, OnInit } from '@angular/core';
import { StockHistory } from '../../../models/stockHistory.model';
import { StocksService } from '../../../services/stocks.service';
import { timestamp } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrl: './view-history.component.css'
})
export class ViewHistoryComponent implements OnInit {

  stocks: StockHistory[] = [];
  constructor(private stocksService: StocksService, private router: Router){}

  ngOnInit(): void {

    let lastPart = this.getLastPartOfCurrentPath();
    console.log(lastPart);
    this.stocksService.getStockHistory(lastPart)
    .subscribe({
      next: (stocks) => {
        this.stocks = stocks;
      },
      error: (response) => {
        console.log(response)
      }
    })
  }
  getLastPartOfCurrentPath(): string {
    let currentPath = this.router.url;
    let parts = currentPath.split("/");
    return parts[parts.length - 1];
  }
}
