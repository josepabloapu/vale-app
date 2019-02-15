import { HttpClient } from '@angular/common/http';
import { Injectable, transition } from '@angular/core';
import { Platform, Header } from 'ionic-angular';
import { CurrencyModel } from '../../models/currency/currency';
import { CategoryModel } from '../../models/category/category';
import { AccountModel } from '../../models/account/account';
import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { UserProvider } from '../../providers/user/user';
import { MessageProvider } from '../../providers/message/message';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import * as papa from 'papaparse';
// import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class ExportProvider {

  public progress: number;
  // private currencies: CurrencyModel [];
  // private categories: CategoryModel [];
  // private accounts: AccountModel [];
  private transactions: TransactionModel [];
  private parsedTransactions: TransactionModel [];
  private headerFields: string [];
  private loading: any;
  // private _htmlProperty: string = '<progress-bar [progress]="exportProvider.progress"></progress-bar>'

  constructor(
    // private _sanitizer: DomSanitizer,
    public platform: Platform,
    public http: HttpClient,
    public file: File,
    public fileChooser: FileChooser,
    public filePath: FilePath,
  	public currencyProvider: CurrencyProvider,
  	public categoryProvider: CategoryProvider,
    public accountProvider: AccountProvider,
    public accountTypeProvider: AccountTypeProvider,
    public transactionProvider: TransactionProvider,
    public userProvider: UserProvider,
    public messageProvider: MessageProvider) 
  {
    this.progress = 0;
    this.initializeVariables();
    // console.log({EXPORT_PROVIDER: this})
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private initializeVariables() {
    this.headerFields = ['type', 'account', 'currency', 'category', 'amount', 'date','description'];
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
  
  private getCategoryReadableObjectByName(name: string = '') {
    return this.categoryProvider.mappedCategoriesByName[name];
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
  		this.parseTransactions().then( transactions => {
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
      
      //create header
      for (let field of this.headerFields) {
        csv += field + ','
      }
      csv += '\r\n';

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

  // private parseData() {
  // 	return new Promise((resolve) => {
  //   	this.setTransactions(this.transactionProvider.transactions);
  //   	this.parseTransactions().then( data => {
  //   		resolve(data)
  //   	});
  // 	})
  // }

  // private parseTransactionsOld() {
  // 	return new Promise((resolve) => {
  // 		this.parsedTransactions = [];
  // 		for (let transaction of this.transactions) {
  // 			transaction.currency = this.getCurrencyReadableObject(transaction.currency).code;
  // 			transaction.category = this.getCategoryReadableObject(transaction.category).name;
  // 			if (this.getAccountReadableObject(transaction.account) == null) {
  // 				transaction.account = "";
  // 			} else {
  // 				transaction.account = this.getAccountReadableObject(transaction.account).name;
  // 			}
  // 			this.parsedTransactions.push(transaction);
  // 		}
  // 		this.refreshTransactions();
  // 		resolve(this.parsedTransactions)
  // 	})
  // }

  private async parseTransactions() {
    let promises = [];
    let transactions: TransactionModel[] = await this.transactionProvider.getAllTransactions()
    for (let transaction of transactions) {
      transaction.currency = this.getCurrencyReadableObject(transaction.currency).code;
      transaction.category = this.getCategoryReadableObject(transaction.category).name;
      if (this.getAccountReadableObject(transaction.account) == null) {
        transaction.account = "";
      } else {
        transaction.account = this.getAccountReadableObject(transaction.account).name;
      }
      promises.push(new Promise((resolve) => {
        resolve(transaction)
      }))
    }
    return Promise.all(promises)
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

  public readLocalFile() {
    this.http.get('assets/data13feb(2).csv', {responseType: 'text'}).subscribe(
      data => this.exportFromCsv(data),
      err => console.log(err)
    );
  }

  public chooseCsvFile() {
    this.fileChooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {
        let path = resolvedFilePath.substring(0, resolvedFilePath.lastIndexOf('/'));
        let file = resolvedFilePath.substring(resolvedFilePath.lastIndexOf('/')+1, resolvedFilePath.length);
        this.readCsvData(path, file)
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }).catch(err => {
      alert(JSON.stringify(err));
  });
  }

  private readCsvData(path, file) {
    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });
    this.file.readAsText(path, file).then( csvData => {
      this.loading.present().then(() => {
        this.exportFromCsv(csvData).then( res => {
          this.loading.dismiss();
        })
      })
    }).catch( err => {
      alert(JSON.stringify(err));
    });
  }

  private async exportFromCsv(csv) {
    let csvData = csv || '';
    let parsedData = papa.parse(csvData).data;
    let headerRow = parsedData[0];
    parsedData.splice(0, 1);
    csvData = parsedData;
    await this.createNewAccountsFromCsv(csvData, headerRow);
    await this.createNewTransactionsFromCsv(csvData, headerRow);
    return new Promise((resolve) => {
      resolve();
    })
  }

  private async createNewTransactionsFromCsv(csv, header){
    let transactions: TransactionModel[] = await this.identifyNewTransactionsFromCsv(csv, header);
    let counter: number = 1;
    let counterEnd: number = transactions.length;
    for (let transaction of transactions) {
      this.progress = counter / counterEnd * 100;
      // console.log(counter + ' of ' + counterEnd)
      await this.transactionProvider.createTransactionFromImportRoutine(transaction);
      counter++;
    }
  }

  private async identifyNewTransactionsFromCsv(csv,header){
    let promises = [];
    let transaction: TransactionModel;
    let accountNameTemp: string;
    for (let line of csv) {
      if (line == "") break;
      transaction = TransactionModel.GetNewInstance();
      transaction['type'] = line[header.findIndex(value => value === 'type')];
      
      accountNameTemp = line[header.findIndex(value => value === 'account')];
      
      if (accountNameTemp) {
        transaction['account'] = this.getAccountReadableObjectByName(line[header.findIndex(value => value === 'account')])._id;
      }
      transaction['currency'] = this.getCurrencyReadableObjectByCode(line[header.findIndex(value => value === 'currency')].toUpperCase())._id;

      if (line[header.findIndex(value => value === 'category')] != 'Investment') {
        transaction['category'] = this.getCategoryReadableObjectByName(line[header.findIndex(value => value === 'category')])._id;
      } else if (line[header.findIndex(value => value === 'type')] == 'expense') {
        transaction['category'] = this.getCategoryReadableObjectByCode('investment-expense')._id;
      } else {
        transaction['category'] = this.getCategoryReadableObjectByCode('investment-income')._id;
      }

      transaction['amount'] = line[header.findIndex(value => value === 'amount')];
      transaction['date'] = line[header.findIndex(value => value === 'date')];
      transaction['description'] = line[header.findIndex(value => value === 'description')];
      transaction.owner = this.userProvider.user._id
      promises.push(new Promise((resolve) => {
        resolve(transaction)
      }))
    }
    return Promise.all(promises)
  }

  private async createNewAccountsFromCsv(csv, header) {
    let promises = []
    let accounts: AccountModel[] = await this.identifyNewAccountsFromCsv(csv, header, this.accountProvider.accounts);
    for (let account of accounts) {
      // console.log({newAccount: account})
      promises.push(new Promise((resolve) => {
        this.accountProvider.createAccount(account).then( () => {
          resolve();
        })
      }))
    }
    return Promise.all(promises)
  }

  private async identifyNewAccountsFromCsv(csv, header, currentAccounts): Promise<any> {
    let accounts: AccountModel[] = await this.identifyAccountsFromCsv(csv, header);
    let promises = []
    for (let account of accounts) {
      if(this.searchAccountName(account.name, currentAccounts) == false) {
        promises.push(new Promise((resolve) => {
          resolve(account);
        }))
      }
    }
    return Promise.all(promises)
  }

  private async identifyAccountsFromCsv(csv, header): Promise<any> {
    let promises = []
    let accounts: AccountModel[] = [];
    let account: AccountModel;
    let accountNameTemp: string;
    for (let line of csv) {
      if (line != "") {
        accountNameTemp = line[header.findIndex(value => value === 'account')]
        if (accountNameTemp != null && accountNameTemp != "") {
          if (this.searchAccountName(accountNameTemp, accounts) != true) {
            account = AccountModel.GetNewInstance();
            account.name = accountNameTemp;
            account.description = 'Automatic generated';
            account.owner = this.userProvider.user._id;
            account.type = this.getAccountTypeReadableObjectByCode('debit-card')._id;
            account.currency = this.getCurrencyReadableObjectByCode(line[header.findIndex(value => value === 'currency')])._id;
            account.initialBalance = 0;
            accounts.push(account);
            promises.push(new Promise((resolve) => {
              resolve(account)
            }))
          }
        }
      }
    }
    return Promise.all(promises)
  }

  private searchAccountName(name, accounts: AccountModel[]) : boolean {
    let isFound: boolean = false;
    accounts.forEach(element => {
      if (element.name == name) isFound = true
    });
    return isFound;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Danger zone */

  public async removeAllTransactions() {
    let transactions: TransactionModel[] = await this.transactionProvider.getAllTransactions()
    let counter = 1;
    let counterEnd = transactions.length;
    for (let transaction of transactions) {
      this.progress = counter / counterEnd * 100;
      // console.log(counter + ' of ' + counterEnd)
      await this.transactionProvider.deleteTransactionFromImportRoutine(transaction)
      counter++;
    }
    return new Promise((resolve) => {
      resolve();
    })
  }
  
  public async removeAllAccounts() {
    let accounts = this.accountProvider.accounts;
    let counter = 1;
    let counterEnd = accounts.length;
    for (let account of accounts) {
      this.progress = counter / counterEnd * 100;
      // console.log(counter + ' of ' + counterEnd)
      await this.accountProvider.deleteAccount(account)
      counter++;
    }
    return new Promise((resolve) => {
      resolve();
    })
  }

  public async removeAllTransactionsWithLoading() {
    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });
    this.loading.present().then(() => {
      this.removeAllTransactions().then( res => {
        this.loading.dismiss();
      })
    })
  }

  public async removeAllAccountsWithLoading() {
    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });
    this.loading.present().then(() => {
      this.removeAllAccounts().then( res => {
        this.loading.dismiss();
      })
    })
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Testing stuff */

  // public htmlProperty() {
  //   return this._sanitizer.bypassSecurityTrustHtml(this._htmlProperty);
  // }

}
