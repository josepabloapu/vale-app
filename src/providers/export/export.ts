import { HttpClient } from '@angular/common/http';
import { Injectable, transition } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { CurrencyModel } from '../../models/currency/currency';
// import { CategoryModel } from '../../models/category/category';
// import { AccountModel } from '../../models/account/account';
import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { UserProvider } from '../../providers/user/user';
import { MessageProvider } from '../../providers/message/message';
import { File } from '@ionic-native/file';
import * as papa from 'papaparse';
import { rejects } from 'assert';
import { AccountModel } from '../../models/account/account';

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
    public accountTypeProvider: AccountTypeProvider,
    public transactionProvider: TransactionProvider,
    public userProvider: UserProvider,
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

  private getCurrencyReadableObjectByCode(code: string = '') {
    return this.currencyProvider.mappedCurrenciesByCode[code];
  }

  private getCategoryReadableObject(id: string = '') {
    return this.categoryProvider.mappedCategoriesById[id];
  }
  
  private getCategoryReadableObjectByCode(code: string = '') {
    return this.categoryProvider.mappedCategoriesByCode[code];
  }

  private getAccountReadableObject(id: string = '') {
    return this.accountProvider.mappedAccountsById[id];
  }

  private getAccountReadableObjectByName(name: string = '') {
    return this.accountProvider.mappedAccountsByName[name];
  }

  private getAccountTypeReadableObjectByCode(code: string = '') {
    return this.accountTypeProvider.mappedAccountTypesByCode[code];
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
  	  		line += transaction[field] + ','
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

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Importing data */

  public readCsvData() {
    this.http.get('assets/dummyData.csv', {responseType: 'text'}).subscribe(
      data => this.extractData(data),
      err => console.log(err)
    );
  }

  private extractData(text) {
    let csvData = text || '';
    let parsedData = papa.parse(csvData).data;
    let headerRow = parsedData[0];
    parsedData.splice(0, 1);
    csvData = parsedData;
    
    // console.log(headerRow);
    // console.log(csvData);

    let transactions: TransactionModel [] = [];

    for (let data of csvData) {
      let transaction = TransactionModel.GetNewInstance();
      transaction[headerRow[0]] = data[0]; // type
      transaction[headerRow[1]] = this.getAccountReadableObjectByName(data[1])._id; // account
      transaction[headerRow[2]] = this.getCategoryReadableObjectByCode(data[2])._id; // category
      transaction[headerRow[3]] = data[3]; // amount
      transaction[headerRow[4]] = this.getCurrencyReadableObjectByCode(data[4])._id; // currency
      transaction[headerRow[5]] = data[5]; // date
      transaction[headerRow[6]] = data[6]; // description
      transaction.owner = this.userProvider.user._id
      transactions.push(transaction);
    }

    console.log(transactions);

    let counter = 0;
    for (let transaction of transactions) {
      
      this.transactionProvider.createTransaction(transaction)
        // .then(
        //   transaction => {
        //     console.log({counter: counter, transaction: transaction});
        //     counter = counter + 1;
        //   }, 
        //   err => {
        //     console.log("Error")
        //     counter = counter + 1;
        //   }
        // );
      console.log({counter: counter});
      counter = counter + 1;
      this.wait(5000);
    }

  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Danger zone */

  public removeAllTransactions() {
    this.transactionProvider.getAllTransactions().then( transactions => {
      let counter = 0;
      for (let transaction of transactions) {
        this.transactionProvider.deleteTransaction(transaction)
          .then( 
            transaction => {
            console.log({counter: counter, transaction: transaction});
            counter = counter + 1;
          },
          err => {
            console.log("Error")
            counter = counter + 1;
          });
        // this.wait(500);
      }
    });
  }

  public removeAllAccounts() {
    let accounts = this.accountProvider.accounts;
    let counter = 0;
    for (let account of accounts) {
      this.accountProvider.deleteAccount(account)
        .then( 
          account => {
          console.log({counter: counter, account: account});
          counter = counter + 1;
        },
        err => {
          console.log("Error")
          counter = counter + 1;
        });
    }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Testing */

  public createAccounts() {
    let account : AccountModel = AccountModel.GetNewInstance();
    let counter = 0;
    account.name = "Planilla";
    account.owner = this.userProvider.user._id;
    account.type = this.getAccountTypeReadableObjectByCode('debit-card')._id;
    account.currency = this.getCurrencyReadableObjectByCode('CRC')._id;
    account.initialBalance = 0;
    this.accountProvider.createAccount(account).then(
      account => {
        console.log({counter: counter, account: account});
        counter = counter + 1;
      }, 
      err => {
        console.log("Error")
        counter = counter + 1;
      }
    );
    account.name = "BCR";
    account.owner = this.userProvider.user._id;
    account.type = this.getAccountTypeReadableObjectByCode('debit-card')._id;
    account.currency = this.getCurrencyReadableObjectByCode('CRC')._id;
    account.initialBalance = 0;
    this.accountProvider.createAccount(account).then(
      account => {
        console.log({counter: counter, account: account});
        counter = counter + 1;
      }, 
      err => {
        console.log("Error")
        counter = counter + 1;
      }
    );
    account.name = "Cash";
    account.owner = this.userProvider.user._id;
    account.type = this.getAccountTypeReadableObjectByCode('debit-card')._id;
    account.currency = this.getCurrencyReadableObjectByCode('CRC')._id;
    account.initialBalance = 0;
    this.accountProvider.createAccount(account).then(
      account => {
        console.log({counter: counter, account: account});
        counter = counter + 1;
      }, 
      err => {
        console.log("Error")
        counter = counter + 1;
      }
    );
    account.name = "Cashback";
    account.owner = this.userProvider.user._id;
    account.type = this.getAccountTypeReadableObjectByCode('credit-card')._id;
    account.currency = this.getCurrencyReadableObjectByCode('CRC')._id;
    account.initialBalance = 0;
    this.accountProvider.createAccount(account).then(
      account => {
        console.log({counter: counter, account: account});
        counter = counter + 1;
      }, 
      err => {
        console.log("Error")
        counter = counter + 1;
      }
    );
    account.name = "Lifemiles";
    account.owner = this.userProvider.user._id;
    account.type = this.getAccountTypeReadableObjectByCode('credit-card')._id;
    account.currency = this.getCurrencyReadableObjectByCode('CRC')._id;
    account.initialBalance = 0;
    this.accountProvider.createAccount(account).then(
      account => {
        console.log({counter: counter, account: account});
        counter = counter + 1;
      }, 
      err => {
        console.log("Error")
        counter = counter + 1;
      }
    );
  }

  private wait(ms) {
    var start = Date.now(),
    now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

}
