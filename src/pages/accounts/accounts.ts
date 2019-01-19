import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AccountModel } from '../../models/account/account';

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
    private toastCtrl: ToastController, 
    public accountProvider: AccountProvider,
    private accountTypeProvider: AccountTypeProvider) 
  {    
    this.getAccounts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountsPage');
  }

  ionViewWillEnter() {
    this.getAccounts();
  }

  public updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
    this.computeAccountsPerType();
    this.computeNetWorth();
  }

  private getAccounts() {
  	this.accountProvider.getAccounts()
  	.then(
  		res => {
  			this.updateAccounts(AccountModel.ParseFromArray(res))
  		},
  		err => this.presentToast(err.error)
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
          // this.navCtrl.push(AccountsPage, { }, { animate: false });
          console.log(res);
          this.presentToast(res);
        }, 
        err => this.presentToast(err.error.message.message)
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

    this.debitAccounts.forEach(function(element) {
      this.assets = this.assets + element.balance;
    }, this);

    // if(false) {
    //   this.investmentAccounts.forEach(function(element) {
    //     this.assets = this.assets + element.balance;
    //   }, this);
    // }

    this.creditAccounts.forEach(function(element) {
      this.liabilities = this.liabilities + element.balance;
    }, this);

    this.liabilities = this.liabilities * (-1);
    this.netWorth = this.assets - this.liabilities;
    
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
