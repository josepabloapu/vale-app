import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

  public currencies: CurrencyModel [];
  public accountTypes: AccountTypeModel [];
  public newAccount: AccountModel;
  public tempAmount: string;
  private loading; any;
  
  constructor(
    private navCtrl: NavController,
    private messageProvider: MessageProvider,
    private userProvider: UserProvider,
    private currencyProvider: CurrencyProvider,
    private accountTypeProvider: AccountTypeProvider, 
    private accountProvider: AccountProvider)
  {
    this.setCurrencies(this.currencyProvider.currencies);
    this.setAccountTypes(this.accountTypeProvider.accountTypes);
    this.initAccount();
    // console.log({PAGE_NEWACCOUNT: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewAccountPage');
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public setCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  public setAccountTypes(accountTypes: AccountTypeModel []) {
    this.accountTypes = accountTypes;
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

    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });

    this.loading.present().then(() => {
      let initialBalance = this.unFormat(this.tempAmount);
      if (initialBalance == "") initialBalance = 0;
      this.newAccount.initialBalance = initialBalance;
      this.accountProvider.createAccount(this.newAccount)
        .then(
          res => {
            this.getAccounts();
            this.loading.dismiss();
            this.messageProvider.displaySuccessMessage('message-new-account-success')
            this.navCtrl.setRoot(AccountsPage);
          }, 
          err => {
            this.loading.dismiss();
            this.messageProvider.displayErrorMessage('message-new-account-error')
          }
        );
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public currencyChange(value) {
    console.log(value);
  }

  public typeChange(value) {
    console.log(value);
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public format(valString) {
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

}
