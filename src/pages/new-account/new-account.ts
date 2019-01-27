import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AccountModel } from '../../models/account/account';
import { CurrencyModel } from '../../models/currency/currency';
import { AccountTypeModel } from '../../models/account-type/account-type';

import { MessageProvider } from '../../providers/message/message';
import { MeProvider } from '../../providers/me/me';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';

import { AccountsPage } from '../../pages/accounts/accounts';

/**
 * Generated class for the NewAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-account',
  templateUrl: 'new-account.html',
})
export class NewAccountPage {

  // private _newAccount: any;
  private newAccount: AccountModel;
  private currencies: CurrencyModel [];
  private accountTypes: AccountTypeModel [];
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider: MessageProvider,
    private meProvider: MeProvider,
    private apiProvider: ApiProvider,
    private currencyProvider: CurrencyProvider,
    private accountTypeProvider: AccountTypeProvider, 
    private accountProvider: AccountProvider)
  {

    // this._currencies = this.currencyProvider._currencies;
    // console.log({CURRENCIES: _currencies})

    this.loadCurrencies();
    this.loadAccountTypes();
    this.initAccount();
    // console.log({PAGE_NEWACCOUNT: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewAccountPage');
  }

  public updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private getDefaultCurrency() {
    return 0
  }

  private loadCurrencies() {
    this.updateCurrencies(this.currencyProvider.currencies);
  }

  public updateAccountTypes(accountTypes: AccountTypeModel []) {
    this.accountTypes = accountTypes;
  }

  private loadAccountTypes() {
    this.updateAccountTypes(this.accountTypeProvider.accountTypes);
  }

  private initAccount() {
    this.newAccount = AccountModel.GetNewInstance();
    this.newAccount.owner = this.meProvider.user._id;
    this.newAccount.type = this.accountTypeProvider.accountTypes[0]._id;
    this.newAccount.currency = this.meProvider.user.currency;
    this.newAccount.initialBalance = null;
    this.newAccount.cumulativeInflow = 0;
    this.newAccount.cumulativeOutflow = 0;
  }

  public createAccount() {
    if (this.newAccount.initialBalance == null) this.newAccount.initialBalance = 0;
    this.accountProvider.createAccount(this.newAccount)
      .then(
        res => {
          this.getAccounts();
          this.navCtrl.setRoot(AccountsPage);
          this.messageProvider.displaySuccessMessage('message-new-account-success')
        }, 
        err => this.messageProvider.displayErrorMessage('message-new-account-error')
      );
  }

  private getAccounts() {
    this.accountProvider.getAccounts();
  }

  currencyChange(value) {
    console.log(value);
  }

  typeChange(value) {
    console.log(value);
  }

}
