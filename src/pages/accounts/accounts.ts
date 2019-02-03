import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserModel } from '../../models/user/user';
import { AccountModel } from '../../models/account/account';

import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';

import { NewAccountPage } from '../../pages/new-account/new-account';
import { EditAccountPage } from '../../pages/edit-account/edit-account';

/**
 * Generated class for the AccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  private user: UserModel;
  private accounts: AccountModel [];

  private debitAccounts: AccountModel [];
  private creditAccounts: AccountModel [];
  private investmentAccounts: AccountModel [];
  private loanAccounts: AccountModel [];
  private cashAccounts: AccountModel [];

  private debitAccountsTrue: Boolean;
  private creditAccountsTrue: Boolean;
  private investmentAccountsTrue: Boolean;
  private loanAccountsTrue: Boolean;
  private cashAccountsTrue: Boolean;

  private netWorth: number;
  private assets: number;
  private liabilities: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private messageProvider: MessageProvider,
    private userProvider: UserProvider, 
    private currencyProvider: CurrencyProvider,
    public accountProvider: AccountProvider,
    private accountTypeProvider: AccountTypeProvider) 
  {
    this.updateAccountsProviderUser(this.userProvider.user);    
    this.getAccounts();
    // console.log({PAGE_ACCOUNTS: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AccountsPage');
  }

  ionViewWillEnter() {
    this.getAccounts();
  }

  public updateAccountsProviderUser(user: UserModel) {
    this.user = user
  }

  public getAccountType(id: string) : string {
    let accountType = this.accountTypeProvider.mappedAccountTypesById[id].code
    return accountType;
  }

  public updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
    this.computeAccountsPerType();
    this.computeNetWorth();
  }

  public getCurrencyReadableObject(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  private getAccounts() {
  	this.accountProvider.getAccounts()
  	.then(
  		res => {
  			this.updateAccounts(AccountModel.ParseFromArray(res))
  		},
  		err => this.messageProvider.displayErrorMessage('message-get-accounts-error')
    );
  }

  private createAccount() {
    this.navCtrl.push(NewAccountPage, { }, { animate: false });
  }

  private markAccountAsDefault(accout: AccountModel) {

  }

  private editAccount(account: AccountModel) {
    this.accountProvider.updateCurrentAccount(account);
    this.navCtrl.push(EditAccountPage, { }, { animate: false });
  }

  private deleteAccount(account: AccountModel) {
    this.accountProvider.deleteAccount(account)
      .then(
        res => {
          this.getAccounts();
          this.messageProvider.displaySuccessMessage('message-delete-account-success')
        }, 
        err => this.messageProvider.displayErrorMessage('message-delete-account-error')
      );
  }

  private computeAccountsPerType() {
    
    this.debitAccounts = [];
    this.creditAccounts = [];
    this.investmentAccounts = [];
    this.loanAccounts = [];
    this.cashAccounts = [];

    this.debitAccountsTrue = false;
    this.creditAccountsTrue = false;
    this.investmentAccountsTrue = false;
    this.loanAccountsTrue = false;
    this.cashAccountsTrue = false;

    this.accounts.forEach(function(element) {
      switch(element.type) {
        case this.accountTypeProvider.mappedAccountTypesByCode['debit-card']._id:
          this.debitAccounts.push(element);
          this.debitAccountsTrue = true;
          break;
        case this.accountTypeProvider.mappedAccountTypesByCode['credit-card']._id:
          this.creditAccounts.push(element);
          this.creditAccountsTrue = true;
          break;
        case this.accountTypeProvider.mappedAccountTypesByCode['investment']._id:
          this.investmentAccounts.push(element);
          this.investmentAccountsTrue = true;
          break;
        case this.accountTypeProvider.mappedAccountTypesByCode['loan']._id:
          this.loanAccounts.push(element);
          this.loanAccountsTrue = true;
          break;
        case this.accountTypeProvider.mappedAccountTypesByCode['cash']._id:
          this.cashAccounts.push(element);
          this.cashAccountsTrue = true;
          break;
        default:
          // code block
      }
    }, this);
  }

  private computeNetWorth() {

    this.assets = 0;
    this.liabilities = 0;

    this.cashAccounts.forEach(function(element) {
      this.assets = this.assets + element.balance;
    }, this);

    this.debitAccounts.forEach(function(element) {
      this.assets = this.assets + element.balance;
    }, this);

    this.investmentAccounts.forEach(function(element) {
      this.assets = this.assets + element.balance;
    }, this);

    this.creditAccounts.forEach(function(element) {
      this.liabilities = this.liabilities + element.balance;
    }, this);

    this.loanAccounts.forEach(function(element) {
      this.liabilities = this.liabilities + element.balance;
    }, this);

    this.liabilities = this.liabilities * (-1);
    this.netWorth = this.assets - this.liabilities;
    
  }

}
