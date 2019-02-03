import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UserModel } from '../../models/user/user';
import { AccountModel } from '../../models/account/account';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { CurrencyProvider } from '../../providers/currency/currency';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type'
import { NewAccountPage } from '../../pages/new-account/new-account';
import { EditAccountPage } from '../../pages/edit-account/edit-account';

@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  public user;
  public debitAccountsTrue: Boolean;
  public creditAccountsTrue: Boolean;
  public investmentAccountsTrue: Boolean;
  public loanAccountsTrue: Boolean;
  public netWorth: number;
  public assets: number;
  public liabilities: number;
  private accounts: AccountModel [];
  private debitAccounts: AccountModel [];
  private creditAccounts: AccountModel [];
  private investmentAccounts: AccountModel [];
  private loanAccounts: AccountModel [];

  constructor(
    private navCtrl: NavController, 
    private messageProvider: MessageProvider,
    private userProvider: UserProvider, 
    private currencyProvider: CurrencyProvider,
    private accountProvider: AccountProvider,
    private accountTypeProvider: AccountTypeProvider) 
  {    
    this.setUser(this.userProvider.user)
    this.getAccounts();
    // console.log({PAGE_ACCOUNTS: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AccountsPage');
  }

  ionViewWillEnter() {
    this.getAccounts();
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public setUser(user: UserModel) : void {
    this.user = user
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  
  private getAccounts() {
  	this.accountProvider.getAccounts()
  	.then(
  		res => {
  			this.updateAccounts(AccountModel.ParseFromArray(res));
  		},
  		err => {
        this.messageProvider.displayErrorMessage('message-get-accounts-error');
      }
    );
  }

  private updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
    this.computeAccountsPerType();
    this.computeNetWorth();
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public getCurrencyReadableObject(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public createAccount() {
    this.navCtrl.push(NewAccountPage, { }, { animate: false });
  }

  public editAccount(account: AccountModel) {
    this.accountProvider.updateCurrentAccount(account);
    this.navCtrl.push(EditAccountPage, { }, { animate: false });
  }

  public deleteAccount(account: AccountModel) {
    this.accountProvider.deleteAccount(account)
      .then(
        res => {
          this.getAccounts();
          this.messageProvider.displaySuccessMessage('message-delete-account-success')
        }, 
        err => this.messageProvider.displayErrorMessage('message-delete-account-error')
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private computeAccountsPerType() {
    
    this.debitAccounts = [];
    this.creditAccounts = [];
    this.investmentAccounts = [];
    this.loanAccounts = [];

    this.debitAccountsTrue = false;
    this.creditAccountsTrue = false;
    this.investmentAccountsTrue = false;
    this.loanAccountsTrue = false;

    var self = this;
    this.accounts.forEach(function(element) {
      switch(element.type) {
        case self.accountTypeProvider.mappedAccountTypesByCode['debit-card']._id:
          self.debitAccounts.push(element);
          self.debitAccountsTrue = true;
          break;
        case self.accountTypeProvider.mappedAccountTypesByCode['credit-card']._id:
          self.creditAccounts.push(element);
          self.creditAccountsTrue = true;
          break;
        case self.accountTypeProvider.mappedAccountTypesByCode['investment']._id:
          self.investmentAccounts.push(element);
          self.investmentAccountsTrue = true;
          break;
        case self.accountTypeProvider.mappedAccountTypesByCode['load']._id:
          self.loanAccounts.push(element);
          self.loanAccountsTrue = true;
          break;
        default:
          alert("Invalid account type");
      }
    });
    
  }

  private computeNetWorth() {

    this.assets = 0;
    this.liabilities = 0;

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
