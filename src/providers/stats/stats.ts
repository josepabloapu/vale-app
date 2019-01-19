import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CurrencyModel } from '../../models/currency/currency';

import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';

/*
  Generated class for the StatsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatsProvider {

	public date: string;
	public currency: CurrencyModel;

  constructor(
    public http: HttpClient, 
    private apiProvider: ApiProvider, 
    private currencyProvider: CurrencyProvider) 
  {
    console.log('Hello StatsProvider Provider');
    this.date = 'this-year';
    this.currency = this.currencyProvider.currencies[0];
    // console.log({ STATS: this });
  }

  public getCategoryBalance(category): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/stats/balance-per-category/categories/' + category._id + '/date/' + this.date + '/currency/' + this.currency._id , true)
        .subscribe(
          res => {
            resolve(res);
          },
          err => reject(<any>err));
    });
  }

}
