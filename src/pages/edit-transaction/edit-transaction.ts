import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { CurrencyModel } from '../../models/currency/currency';
import { CategoryModel } from '../../models/category/category';
import { AccountModel } from '../../models/account/account';
import { TransactionModel } from '../../models/transaction/transaction';
import { MessageProvider } from '../../providers/message/message';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { TransactionsPage } from '../../pages/transactions/transactions';

@IonicPage()
@Component({
  selector: 'page-edit-transaction',
  templateUrl: 'edit-transaction.html',
})
export class EditTransactionPage {

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

  public currencies: CurrencyModel [];
  public incomeCategories: CategoryModel [];
  public expenseCategories: CategoryModel [];
  public accounts: AccountModel [];
  public tempDate: string;
  private editTransaction: TransactionModel;
  private categories: CategoryModel [];
  private tempAmount: string;
  private date: Date;
  private isoDate: string;
  private loading: any;

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

    this.date = new Date();
    this.isoDate = new Date().toISOString();
  	this.setCurrencies(this.currencyProvider.currencies);
    this.setCategories(this.categoryProvider.categories);
    this.setAccounts(this.accountProvider.accounts);
    this.setTransaction(this.transactionProvider.currentTransaction);
    // console.log({EDIT_TRANSACTION: this})

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditAccountPage');
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public setCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  public setCategories(categories: CategoryModel []) {
    this.categories = categories;
    this.computeCategoriesPerType();
  }

  public setAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
  }

  private setTransaction(transaction: TransactionModel) {
    this.tempAmount = this.format(transaction.amount);
    this.tempDate = this.unparseDate(transaction.date);
    this.editTransaction = transaction;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public updateTransaction() {

    this.editTransaction.amount = this.unFormat(this.tempAmount);
    this.editTransaction.date = this.parseDate(this.tempDate);

    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });

    this.loading.present().then(() => {
      this.transactionProvider.updateTransaction(this.editTransaction)
      .then(
        res => {
          this.loading.dismiss();
          this.messageProvider.displaySuccessMessage('message-update-transaction-success')
          this.navCtrl.setRoot(TransactionsPage);  
        }, 
        err => {
          this.loading.dismiss();
          this.messageProvider.displayErrorMessage('message-update-transaction-error')
        }
      );
    });
    
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

    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });

    this.loading.present().then(() => {
      this.transactionProvider.deleteTransaction(this.editTransaction)
      .then(
        res => {
          this.loading.dismiss();
          this.messageProvider.displaySuccessMessage('message-delete-transaction-success')
          this.navCtrl.setRoot(TransactionsPage);
        }, 
        err => {
          this.loading.dismiss();
          this.messageProvider.displayErrorMessage('message-delete-transaction-error')
        }
      );
    });
    
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public accountChange(value) {
    this.editTransaction.currency = this.accountProvider.mappedAccountsById[value].currency
  }

  public typeChange(value) {
    if (value == 'expense') {
      this.editTransaction.category = this.categoryProvider.mappedCategoriesByName['Living']._id;
    }
    if (value == 'income') {
      this.editTransaction.category = this.categoryProvider.mappedCategoriesByName['Wage']._id;
    }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private computeCategoriesPerType() {
    
    this.incomeCategories = [];
    this.expenseCategories = [];

    var self = this;
    this.categories.forEach(function(element) {
      switch(element.type) {
        case 'income':
          self.incomeCategories.push(element);
          break;
        case 'expense':
          self.expenseCategories.push(element);
          break;
        case 'transfer':
          self.incomeCategories.push(element);
          self.expenseCategories.push(element);
        default:
          // code block
      }
    });
  }

  private format(valString) {
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

  public parseDate(localISO: string): string {
    let tempTime = new Date(localISO);
    let utcISO = new Date(tempTime.getTime() + this.date.getTimezoneOffset() * 60000).toISOString();
    return utcISO;
  }

  private unparseDate(utcISO) {
    let tempTime = new Date(utcISO);
    let localISO = new Date(tempTime.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();
    return localISO;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public getCategoryReadableObject(id: string = '') {
    return this.categoryProvider.mappedCategoriesById[id];
  }

  public getAccountReadableObject(id: string = '') {
    return this.accountProvider.mappedAccountsById[id];
  }

  public getCurrencyReadableObject(id: string = '') {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

}
