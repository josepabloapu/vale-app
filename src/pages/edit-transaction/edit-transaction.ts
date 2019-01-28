import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyModel } from '../../models/currency/currency';
import { CategoryModel } from '../../models/category/category';
import { AccountModel } from '../../models/account/account';

import { MessageProvider } from '../../providers/message/message';
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

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

	private editTransaction: TransactionModel;
  private currencies: CurrencyModel [];
  private categories: CategoryModel [];
  private incomeCategories: CategoryModel [];
  private expenseCategories: CategoryModel [];
  private accounts: AccountModel [];
  private tempAmount: string;

  constructor(
    public app: App,
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private messageProvider: MessageProvider,
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
    // console.log('ionViewDidLoad EditAccountPage');
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
    this.tempAmount = this.format(transaction.amount);
    this.editTransaction = transaction;
  }

  private getTransaction() {
  	this.updateTransactionLocalObject(this.transactionProvider.currentTransaction)
  }

  private updateTransaction() {
    this.editTransaction.amount = this.unFormat(this.tempAmount);
  	this.transactionProvider.updateTransaction(this.editTransaction)
      .then(
        res => {
          this.messageProvider.displaySuccessMessage('message-update-transaction-success')
          this.navCtrl.setRoot(TransactionsPage);  
        }, 
        err => this.messageProvider.displayErrorMessage('message-update-transaction-error')
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public deleteAlertMessage() {
    this.messageProvider.displayAlertConfirmMessage('are-you-sure?').then( res => {
      if (this.messageProvider.flag == true) {
        this.deleteTransaction()
        this.messageProvider.flag = false;
      }
    });
  }

  private deleteTransaction() {
    this.transactionProvider.deleteTransaction(this.editTransaction)
      .then(
        res => {
          this.messageProvider.displaySuccessMessage('message-delete-transaction-success')
          this.navCtrl.setRoot(TransactionsPage);
        }, 
        err => this.messageProvider.displayErrorMessage('message-delete-transaction-error')
      );
  }

  private doNothing() {

  }

  /* ---------------------------------------------------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------------------------------------------------- */

  getCategoryReadableObject(id: string = '') {
    return this.categoryProvider.mappedCategoriesById[id];
  }

  getAccountReadableObject(id: string = '') {
    return this.accountProvider.mappedAccountsById[id];
  }

  getCurrencyReadableObject(id: string = '') {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

}
