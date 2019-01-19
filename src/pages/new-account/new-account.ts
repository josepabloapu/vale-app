import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AccountModel } from '../../models/account/account';
import { CurrencyModel } from '../../models/currency/currency';
import { AccountTypeModel } from '../../models/account-type/account-type';

import { UserProvider } from '../../providers/user/user';
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
    private toastCtrl: ToastController,
    private userProvider: UserProvider,
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAccountPage');
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
    this.newAccount.owner = this.userProvider.user._id;
    this.newAccount.type = this.accountTypeProvider.accountTypes[0]._id;
    this.newAccount.currency = this.userProvider.user.currency;
    this.newAccount.initialBalance = 0;
    this.newAccount.cumulativeInflow = 0;
    this.newAccount.cumulativeOutflow = 0;
  }

  public createAccount() {
    // console.log(this._currencies[0]);
    this.accountProvider.createAccount(this.newAccount)
      .then(
        res => {
          this.getAccounts();
          this.navCtrl.setRoot(AccountsPage);
          this.presentToast('new-account-has-been-created');
        }, 
        err => this.presentToast(err.error)
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
