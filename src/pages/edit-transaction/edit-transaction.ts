import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyModel } from '../../models/currency/currency';
import { CategoryModel } from '../../models/category/category';
import { AccountModel } from '../../models/account/account';

import { TransactionProvider } from '../../providers/transaction/transaction';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';

import { TransactionsPage } from '../../pages/transactions/transactions';

/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-transaction',
  templateUrl: 'edit-transaction.html',
})
export class EditTransactionPage {

	private editTransaction: TransactionModel;
  private currencies: CurrencyModel [];
  private categories: CategoryModel [];
  private incomeCategories: CategoryModel [];
  private expenseCategories: CategoryModel [];
  private accounts: AccountModel [];

  constructor(
    public app: App,
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private toastCtrl: ToastController,
  	private currencyProvider: CurrencyProvider,
    private categoryProvider: CategoryProvider,
  	private transactionProvider: TransactionProvider,
  	private accountProvider: AccountProvider) 
  {
  	this.loadCurrencies();
    this.loadCategories();
    this.loadAccounts();
  	this.getTransaction();
    console.log({EDIT_TRANSACTION: this})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditAccountPage');
  }

  /* CURRENCIES */
  /**************/

  public updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private loadCurrencies() {
    this.updateCurrencies(this.currencyProvider.currencies);
  }

  /* CATEGORIES */
  /************/

  public updateCategories(categories: CategoryModel []) {
    this.categories = categories;
    this.computeCategoriesPerType();
  }

  private loadCategories() {
    this.updateCategories(this.categoryProvider.categories);
  }

  /* ACCOUNTS */
  /************/

  public updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
  }

  private loadAccounts() {
    this.updateAccounts(this.accountProvider.accounts);
  }

  public updateTransactionLocalObject(transaction: TransactionModel) {
    this.editTransaction = transaction;
  }

  private getTransaction() {
  	this.updateTransactionLocalObject(this.transactionProvider.currentTransaction)
  }

  private updateTransaction(transaction: TransactionModel) {
  	this.transactionProvider.updateTransaction(transaction)
      .then(
        res => {
          let response = res as any;
          this.navCtrl.setRoot(TransactionsPage);
          this.presentToast('transaction-has-been-updated');
        }, 
        err => this.presentToast(err.error)
      );
  }

  private deleteTransaction(transaction: TransactionModel) {
    this.transactionProvider.deleteTransaction(transaction)
      .then(
        res => {
          this.navCtrl.setRoot(TransactionsPage);
          this.presentToast('transaction-has-been-deleted');
        }, 
        err => this.presentToast(err.error)
      );
  }

  accountChange(value) {
    this.editTransaction.currency = this.accountProvider.mappedAccountsById[value].currency
  }

  typeChange(value) {
    if (value == 'expense') {
      this.editTransaction.category = this.categoryProvider.mappedCategoriesByName['Living']._id;
    }
    if (value == 'income') {
      this.editTransaction.category = this.categoryProvider.mappedCategoriesByName['Wage']._id;
    }
  }

  private computeCategoriesPerType() {
    
    this.incomeCategories = [];
    this.expenseCategories = [];

    this.categories.forEach(function(element) {
      switch(element.type) {
        case 'income':
          this.incomeCategories.push(element);
          break;
        case 'expense':
          this.expenseCategories.push(element);
          break;
        default:
          // code block
      }
    }, this);
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
