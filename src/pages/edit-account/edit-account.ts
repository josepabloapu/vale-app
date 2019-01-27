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

/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-account',
  templateUrl: 'edit-account.html',
})
export class EditAccountPage {

	private editAccount: AccountModel;
  private currencies: CurrencyModel [];
  private accountTypes: AccountTypeModel [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private messageProvider: MessageProvider,
  	private currencyProvider: CurrencyProvider,
    private accountTypeProvider: AccountTypeProvider, 
  	private accountProvider: AccountProvider) 
  {
  	this.loadCurrencies();
    this.loadAccountTypes();
  	this.getAccount();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditAccountPage');
  }

  public updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
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

  public updateAccountLocalObject(account: AccountModel) {
    this.editAccount = account;
  }

  private getAccount() {
  	this.updateAccountLocalObject(this.accountProvider.currentAccount)
  }

  public getCurrencyReadableObject(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  private updateAccount() {
  	this.accountProvider.updateAccount(this.editAccount)
      .then(
        res => {
          let response = res as any;
          this.navCtrl.setRoot(AccountsPage);
          this.messageProvider.displaySuccessMessage('message-update-account-success')
        }, 
        err => this.messageProvider.displayErrorMessage('message-update-account-error')
      );
  }

  private deleteAccount(account: AccountModel) {
    this.accountProvider.deleteAccount(account)
      .then(
        res => {
          this.navCtrl.setRoot(AccountsPage);
          this.messageProvider.displaySuccessMessage('message-delete-account-success')
        }, 
        err => this.messageProvider.displayErrorMessage('message-delete-account-error')
      );
  }

}
