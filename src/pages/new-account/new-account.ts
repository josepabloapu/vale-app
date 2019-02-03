import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { ViewChild } from '@angular/core';

import { AccountModel } from '../../models/account/account';
import { CurrencyModel } from '../../models/currency/currency';
import { AccountTypeModel } from '../../models/account-type/account-type';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { AccountsPage } from '../../pages/accounts/accounts';

@IonicPage()
@Component({
  selector: 'page-new-account',
  templateUrl: 'new-account.html',
})
export class NewAccountPage {

  // @ViewChild('myInput') myInput;

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

  private newAccount: AccountModel;
  private currencies: CurrencyModel [];
  private accountTypes: AccountTypeModel [];
  private tempAmount: string;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider: MessageProvider,
    private userProvider: UserProvider,
    private currencyProvider: CurrencyProvider,
    private accountTypeProvider: AccountTypeProvider, 
    private accountProvider: AccountProvider)
  {
    this.loadCurrencies();
    this.loadAccountTypes();
    this.initAccount();
    // console.log({PAGE_NEWACCOUNT: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewAccountPage');
  }

  // ngAfterViewChecked() {
  //   this.myInput.setFocus()
  // }

  /* ---------------------------------------------------------------------------------------------------------------- */

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

  private getAccounts() {
    this.accountProvider.getAccounts();
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private initAccount() {
    this.newAccount = AccountModel.GetNewInstance();
    this.newAccount.owner = this.userProvider.user._id;
    this.newAccount.type = this.accountTypeProvider.accountTypes[0]._id;
    this.newAccount.currency = this.userProvider.user.currency;
    this.newAccount.initialBalance = null;
    this.newAccount.cumulativeInflow = 0;
    this.newAccount.cumulativeOutflow = 0;
  }

  public createAccount() {
    let initialBalance = this.unFormat(this.tempAmount);
    if (initialBalance == "") initialBalance = 0;
    this.newAccount.initialBalance = initialBalance;
    this.accountProvider.createAccount(this.newAccount)
      .then(
        res => {
          this.getAccounts();
          this.messageProvider.displaySuccessMessage('message-new-account-success')
          this.navCtrl.setRoot(AccountsPage);
        }, 
        err => this.messageProvider.displayErrorMessage('message-new-account-error')
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  currencyChange(value) {
    console.log(value);
  }

  typeChange(value) {
    console.log(value);
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  format(valString) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
  };

  unFormat(val) {
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

}
