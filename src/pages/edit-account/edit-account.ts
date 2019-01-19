import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AccountModel } from '../../models/account/account';
import { AccountTypeModel } from '../../models/account-type/account-type';
import { CurrencyModel } from '../../models/currency/currency';

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
  	private toastCtrl: ToastController,
  	private currencyProvider: CurrencyProvider,
    private accountTypeProvider: AccountTypeProvider, 
  	private accountProvider: AccountProvider) 
  {
  	this.loadCurrencies();
    this.loadAccountTypes();
  	this.getAccount();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditAccountPage');
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

  private updateAccount(account: AccountModel) {
  	this.accountProvider.updateAccount(account)
      .then(
        res => {
          let response = res as any;
          this.navCtrl.setRoot(AccountsPage);
          this.presentToast('an-account-has-been-updated');
        }, 
        err => this.presentToast(err.error)
      );
  }

  private deleteAccount(account: AccountModel) {
    this.accountProvider.deleteAccount(account)
      .then(
        res => {
          this.navCtrl.setRoot(AccountsPage);
          this.presentToast('an-account-has-been-deleted');
        }, 
        err => this.presentToast(err.error)
      );
  }

  presentToast(message) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

  }

}
