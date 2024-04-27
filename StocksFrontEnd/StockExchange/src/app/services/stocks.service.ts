import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Stock } from '../models/stock.model';
import { Observable } from 'rxjs';
import { StockHistory } from '../models/stockHistory.model';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  getAllStocks(): Observable<Stock[]>
  {
    return this.http.get<Stock[]>(this.baseApiUrl + '/API/stocks')
  }
  getStockHistory(symbol: string): Observable<StockHistory[]>
  {
    return this.http.get<StockHistory[]>(this.baseApiUrl + '/API/stocks/' + symbol + '/history')
  }
}
