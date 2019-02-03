import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CurrencyModel } from '../../models/currency/currency';

import { ApiProvider } from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
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
    private userProvider: UserProvider,
    private currencyProvider: CurrencyProvider) 
  {
    this.currency = this.currencyProvider.mappedCurrenciesById[this.userProvider.user.currency];
    // console.log({ STATS: this });
  }

  public getBalancePerCategoryAndDate(category, date): Promise<any> {
    return new Promise((resolve, reject) => {
      var balance: any;
      this.apiProvider.getRequest('/stats/balance-per-category/categories/' + category._id + '/date/' + date + '/currency/' + this.currency._id , true)
        .subscribe(
          result => {
            balance = result;
            resolve(balance.amount);
          },
          err => reject(<any>err));
    });
  }

}
