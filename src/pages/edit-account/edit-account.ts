import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AccountModel } from '../../models/account/account';
import { AccountTypeModel } from '../../models/account-type/account-type';
import { CurrencyModel } from '../../models/currency/currency';
import { MessageProvider } from '../../providers/message/message';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AccountsPage } from '../../pages/accounts/accounts';

@IonicPage()
@Component({
  selector: 'page-edit-account',
  templateUrl: 'edit-account.html',
})
export class EditAccountPage {

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

	public editAccount: AccountModel;
  public currencies: CurrencyModel [];
  public accountTypes: AccountTypeModel [];
  public tempAmount: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	public messageProvider: MessageProvider,
  	public currencyProvider: CurrencyProvider,
    public accountTypeProvider: AccountTypeProvider, 
  	public accountProvider: AccountProvider) 
  {
  	this.setCurrencies(this.currencyProvider.currencies);
    this.setAccountTypes(this.accountTypeProvider.accountTypes);
  	this.setAccount(this.accountProvider.currentAccount);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditAccountPage');
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private setCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private setAccountTypes(accountTypes: AccountTypeModel []) {
    this.accountTypes = accountTypes;
  }

  private setAccount(account: AccountModel) {
    let initialBalance = this.format(account.initialBalance);
    if (initialBalance == "") initialBalance = "0";
    this.tempAmount = initialBalance;
    this.editAccount = account;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public getCurrencyReadableObject(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public updateAccount() {
    let initialBalance = this.unFormat(this.tempAmount);
    if (initialBalance == "") initialBalance = 0;
    this.editAccount.initialBalance = initialBalance;
  	this.accountProvider.updateAccount(this.editAccount)
      .then(
        res => {
          this.messageProvider.displaySuccessMessage('message-update-account-success')
          this.navCtrl.setRoot(AccountsPage);
        }, 
        err => this.messageProvider.displayErrorMessage('message-update-account-error')
      );
  }

  private deleteAccount() {
    this.accountProvider.deleteAccount(this.editAccount)
      .then(
        res => {
          this.messageProvider.displaySuccessMessage('message-delete-account-success')
          this.navCtrl.setRoot(AccountsPage);
        }, 
        err => this.messageProvider.displayErrorMessage('message-delete-account-error')
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private format(valString) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
  };

  private unFormat(val) {
      if (!val) {
          return '';
      }
      val = val.replace(/^0+/, '');
  
      if (this.GROUP_SEPARATOR === ',') {
          return val.replace(/,/g, '');
      } else {
          return val.replace(/\./g, '');
      }
  };

  /* ---------------------------------------------------------------------------------------------------------------- */

  public deleteAlertMessage() {
    this.messageProvider.displayAlertConfirmMessage('are-you-sure?').then( res => {
      if (this.messageProvider.flag == true) {
        this.deleteAccount()
        this.messageProvider.flag = false;
      }
    });
  }

}
