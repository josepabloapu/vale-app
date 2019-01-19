import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { TransactionModel } from '../../models/transaction/transaction';
import { AccountModel } from '../../models/account/account';
import { CategoryModel } from '../../models/category/category';

import { TransactionProvider } from '../../providers/transaction/transaction';
import { CategoryProvider } from '../../providers/category/category';
import { AccountProvider } from '../../providers/account/account';

import { NewTransactionPage } from '../../pages/new-transaction/new-transaction';
import { EditTransactionPage } from '../../pages/edit-transaction/edit-transaction';

/**
 * Generated class for the TransactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  private transactions: TransactionModel [];
  private accounts: AccountModel [];
  private categories: CategoryModel [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private categoryProvider: CategoryProvider,
    private accountProvider: AccountProvider,
    public transactionProvider: TransactionProvider) 
  {
    this.getCategories();
    this.getAccounts();
    this.getTransactions();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
  }

  ionViewWillEnter() {
    this.getTransactions();
  }

  public updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
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

  public updateTransactions(transactions: TransactionModel []) {
    this.transactions = transactions;
  }

  private getTransactions() {
    this.transactionProvider.getTransactions()
    .then(
      res => {
        this.updateTransactions(TransactionModel.ParseFromArray(res))
      },
      err => this.presentToast(err.error)
    );
  }

  public updateCategories(categories: CategoryModel []) {
    this.categories = categories;
  }

  private getCategories() {
    this.categoryProvider.getCategories()
    .then(
      res => {
        this.updateCategories(CategoryModel.ParseFromArray(res))
      },
      err => this.presentToast(err.error)
    );
  }

  private createTransaction() {
    this.navCtrl.push(NewTransactionPage, { }, { animate: false });
  }

  private editTransaction(transaction: TransactionModel) {
    this.transactionProvider.updateCurrentTransaction(transaction);
    this.navCtrl.push(EditTransactionPage, { }, { animate: false });
  }

  private deleteTransaction(transaction: TransactionModel) {
    this.transactionProvider.deleteTransaction(transaction)
      .then(
        res => {
          this.getTransactions();
          console.log(res);
          this.presentToast(res);
        }, 
        err => this.presentToast(err.error)
      );
  }

  getCategoryReadableName(id: string) {
    return this.categoryProvider.mappedCategoriesById[id];
  }

  getAccountReadableName(id: string) {
    return this.accountProvider.mappedAccountsById[id];
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
