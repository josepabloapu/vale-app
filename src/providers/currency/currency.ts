import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrencyModel } from '../../models/currency/currency';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class CurrencyProvider {

  public currencies: CurrencyModel [];
  public mappedCurrenciesById: {};
  public mappedCurrenciesByName: {};

  constructor(public http: HttpClient, private apiProvider: ApiProvider) {
    // console.log({ CURRENCY: this });
    this.getCurrencies();
  }

  public updateCurrencyProvider(currencies: CurrencyModel []) {
    this.currencies = currencies;
    this.updateMappedCurrencies(this.currencies);
  }

  private updateMappedCurrencies(array) {
    this.mappedCurrenciesById = {}
    array.forEach(function(element) {
      this.mappedCurrenciesById[element._id] = element
    }, this);
    this.mappedCurrenciesByName = {}
    array.forEach(function(element) {
      this.mappedCurrenciesByName[element.name] = element
    }, this);
  }

  public getCurrencies(): Promise<any> {
  	return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/currencies', false)
        .subscribe(
          res => {
            this.updateCurrencyProvider(CurrencyModel.ParseFromArray(res));
            resolve(CurrencyModel.ParseFromArray(res));
          },
          err => reject(<any>err));
    });
  }

}
