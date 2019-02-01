import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { CurrencyModel } from '../../models/currency/currency';
import { CategoryModel } from '../../models/category/category';
import { AccountModel } from '../../models/account/account';
import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { AccountProvider } from '../../providers/account/account';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { MessageProvider } from '../../providers/message/message';

@Injectable()
export class ExportProvider {

  private currencies: CurrencyModel [];
  private categories: CategoryModel [];
  private accounts: AccountModel [];
  private transactions: TransactionModel [];
  private parsedTransactions: TransactionModel [];
  private headerFields: string [];

  constructor(
    public platform: Platform,
  	public http: HttpClient,
  	public currencyProvider: CurrencyProvider,
  	public categoryProvider: CategoryProvider,
  	public accountProvider: AccountProvider,
  	public transactionProvider: TransactionProvider,
  	public messageProvider: MessageProvider) 
  {
    this.headerFields = ['type', 'account', 'category', 'amount', 'date','description'];
    this.loadCurrencies();
    this.loadCategories();
    this.loadAccounts();
    this.loadTransactions();
    // console.log({EXPORT_PROVIDER: this})
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private loadCurrencies() {
    this.updateCurrencies(this.currencyProvider.currencies);
  }

  public updateCategories(categories: CategoryModel []) {
    this.categories = categories;
  }

  private loadCategories() {
    this.updateCategories(this.categoryProvider.categories);
  }

  public updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts;
  }

  private loadAccounts() {
    this.updateAccounts(this.accountProvider.accounts);
  }

  private updateTransactions(transactions: TransactionModel []) {
    this.transactions = transactions;
  }

  private loadTransactions() {
    this.updateTransactions(this.transactionProvider.transactions);
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private getCurrencyReadableObject(id: string = '') {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  private getCategoryReadableObject(id: string = '') {
    return this.categoryProvider.mappedCategoriesById[id];
  }

  private getAccountReadableObject(id: string = '') {
    return this.accountProvider.mappedAccountsById[id];
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private parseData() {
  	return new Promise((resolve) => {
  		this.loadCurrencies();
    	this.loadCategories();
    	this.loadAccounts();
    	this.loadTransactions();
    	this.parseTransactions().then( data => {
    		resolve(data)
    	});
  	})
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public getCSV() {
  	return new Promise((resolve) => {
  		this.parseData().then( res => {
  			let csv = '';
    	  this.convertToCSV(res).then( csv => {
    	  	resolve(csv);
    	  });
  		});
  	})
  }

  private parseTransactions() {
  	return new Promise((resolve) => {
  		this.parsedTransactions = [];
  		for (let transaction of this.transactions) {
  			transaction.currency = this.getCurrencyReadableObject(transaction.currency).name;
  			transaction.category = this.getCategoryReadableObject(transaction.category).name;
  			if (this.getAccountReadableObject(transaction.account) == null) {
  				transaction.account = "";
  			} else {
  				transaction.account = this.getAccountReadableObject(transaction.account).name;
  			}
  			this.parsedTransactions.push(transaction);
  		}
  		this.refreshTransactions();
  		resolve(this.parsedTransactions)
  	})
  }

  private  convertToCSV(transactions) {
  	return new Promise((resolve) => {
  	  var csv: any = '';
  	  var line: any = '';
  	  for (let transaction of transactions) {
  	  	line = '';
  	  	for (let field of this.headerFields) {
  	  		line += transaction[field] + '; '
  	  	}
  	  	csv += line + '\r\n';
  	  }
  	  resolve(csv);
  	})
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private refreshTransactions() {
    this.transactionProvider.getTransactions().then( res => {
        this.updateTransactions(TransactionModel.ParseFromArray(res));
      },
      err => {
      	this.messageProvider.displaySuccessMessage('message-get-transactions-error');
      }
    );
  }

}
