import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { CurrencyModel } from '../../models/currency/currency';
// import { CategoryModel } from '../../models/category/category';
// import { AccountModel } from '../../models/account/account';
import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { AccountProvider } from '../../providers/account/account';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { MessageProvider } from '../../providers/message/message';
import { File } from '@ionic-native/file';

@Injectable()
export class ExportProvider {

  // private currencies: CurrencyModel [];
  // private categories: CategoryModel [];
  // private accounts: AccountModel [];
  private transactions: TransactionModel [];
  private parsedTransactions: TransactionModel [];
  private headerFields: string [];

  constructor(
    public platform: Platform,
    public http: HttpClient,
    public file: File,
  	public currencyProvider: CurrencyProvider,
  	public categoryProvider: CategoryProvider,
  	public accountProvider: AccountProvider,
  	public transactionProvider: TransactionProvider,
  	public messageProvider: MessageProvider) 
  {
    this.initializeVariables();
    // console.log({EXPORT_PROVIDER: this})
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private initializeVariables() {
    this.headerFields = ['type', 'account', 'category', 'amount', 'date','description'];
    // this.setCurrencies(this.currencyProvider.currencies);
    // this.setCategories(this.categoryProvider.categories);
    // this.setAccounts(this.accountProvider.accounts);
    this.setTransactions(this.transactionProvider.transactions);
  }

  // public setCurrencies(currencies: CurrencyModel []) {
  //   this.currencies = currencies;
  // }

  // public setCategories(categories: CategoryModel []) {
  //   this.categories = categories;
  // }

  // public setAccounts(accounts: AccountModel []) {
  //   this.accounts = accounts;
  // }

  private setTransactions(transactions: TransactionModel []) {
    this.transactions = transactions;
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
  /* Exporting data */

  public computeCSV() {
  	return new Promise((resolve) => {
  		this.parseData().then( transactions => {
    	  this.convertToCSV(transactions).then( csv => {
    	  	resolve(csv);
    	  });
  		});
  	})
  }

  public createCVS() {
    return new Promise((resolve) => {
      this.file.createDir(this.file.externalRootDirectory, 'Transactions', true)
        .then( (directory) => {
          this.computeCSV().then( (csv: string) => {
            this.file.writeFile(directory.toURL(), 'data.csv', csv, {replace: true}).then( _ => {
              alert('Data has been exported. ' + directory.toURL() + 'data.csv');
              resolve();
            })
          })
        })
        .catch( (err) => {
          alert('Directory was not created');
        })
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

  private parseData() {
  	return new Promise((resolve) => {
  		// this.loadCurrencies();
    	// this.loadCategories();
    	// this.loadAccounts();
    	this.setTransactions(this.transactionProvider.transactions);
    	this.parseTransactions().then( data => {
    		resolve(data)
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

  private refreshTransactions() {
    this.transactionProvider.getTransactions().then( res => {
        this.setTransactions(TransactionModel.ParseFromArray(res));
      },
      err => {
      	this.messageProvider.displaySuccessMessage('message-get-transactions-error');
      }
    );
  }

}
