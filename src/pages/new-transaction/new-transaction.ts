import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
// import { ViewChild } from '@angular/core';
import { TransactionModel } from '../../models/transaction/transaction';
import { CurrencyModel } from '../../models/currency/currency';
import { CategoryModel } from '../../models/category/category';
import { AccountModel } from '../../models/account/account';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { AccountProvider } from '../../providers/account/account';
import { TransactionsPage } from '../../pages/transactions/transactions';

@IonicPage()
@Component({
  selector: 'page-new-transaction',
  templateUrl: 'new-transaction.html',
})
export class NewTransactionPage {

  // @ViewChild('myInput') myInput;

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";

  public currencies: CurrencyModel [];
  public incomeCategories: CategoryModel [];
  public expenseCategories: CategoryModel [];
  public accounts: AccountModel [];
  public isTransfer: boolean;

  private newTransaction: TransactionModel;
  private newTransactionOut: TransactionModel;
  private newTransactionIn: TransactionModel;
  private categories: CategoryModel [];
  private accountOut: string;
  private accountIn: string;
  private tempAmount: string;
  
  constructor(
    private navCtrl: NavController,
    private messageProvider: MessageProvider,
    private userProvider: UserProvider,
    private currencyProvider: CurrencyProvider,
    private categoryProvider: CategoryProvider,
    private transactionProvider: TransactionProvider,
    private accountProvider: AccountProvider)
  {
    this.isTransfer = false;
    this.accountOut = '';
    this.accountIn = '';
    this.tempAmount = ''
    this.setAccounts(this.accountProvider.accounts);
    this.setCurrencies(this.currencyProvider.currencies);
    this.setCategories(this.categoryProvider.categories);
    this.initTransaction();
    // console.log({NEW_TRANSACTION: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewTransactionPage');
  }

  // ngAfterViewChecked() {
  //   this.myInput.setFocus()
  // }

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

  /* ---------------------------------------------------------------------------------------------------------------- */

  private initTransaction() {
    this.newTransaction = TransactionModel.GetNewInstance();
    this.newTransaction.owner = this.userProvider.user._id;
    this.newTransaction.currency = this.userProvider.user.currency;
    this.newTransaction.type = 'expense';
    this.newTransaction.description = '';
    this.newTransaction.category = this.categoryProvider.mappedCategoriesByName['Living']._id;
    if(this.accountProvider.accounts.length != 0) {
      this.newTransaction.account = this.accountProvider.accounts[0]._id;
    }
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public createTransaction() {
    this.newTransaction.amount = this.unFormat(this.tempAmount);
    this.transactionProvider.createTransaction(this.newTransaction)
      .then(
        res => {
          this.messageProvider.displaySuccessMessage('message-new-transaction-success');
          this.navCtrl.setRoot(TransactionsPage);
         
        }, 
        err => {
          this.messageProvider.displayErrorMessage('message-new-transaction-error');
        }
      );
  }

  public createTransferTransaction() {
    this.newTransaction.amount = this.unFormat(this.tempAmount);
    
    this.newTransactionOut = TransactionModel.GetNewInstance();
    this.newTransactionIn = TransactionModel.GetNewInstance();

    this.newTransactionOut.owner = this.newTransaction.owner;
    this.newTransactionIn.owner = this.newTransaction.owner;

    this.newTransactionOut.amount = this.newTransaction.amount;
    this.newTransactionIn.amount = this.newTransaction.amount;

    this.newTransactionOut.category = this.newTransaction.category;
    this.newTransactionIn.category = this.newTransaction.category;

    this.newTransactionOut.currency = this.accountProvider.mappedAccountsById[this.accountOut].currency
    this.newTransactionIn.currency = this.accountProvider.mappedAccountsById[this.accountIn].currency

    this.newTransactionOut.description = this.newTransaction.description + ' >>> ' + this.accountProvider.mappedAccountsById[this.accountIn].name;
    this.newTransactionIn.description = this.newTransaction.description + ' <<< ' + this.accountProvider.mappedAccountsById[this.accountOut].name;

    this.newTransactionOut.type = 'expense';
    this.newTransactionIn.type = 'income';

    this.newTransactionOut.account = this.accountOut;
    this.newTransactionIn.account = this.accountIn;

    this.transactionProvider.createTransaction(this.newTransactionOut)
      .then(
        res => {
          
          this.transactionProvider.createTransaction(this.newTransactionIn)
            .then(
              res => {
                this.messageProvider.displaySuccessMessage('message-new-two-transactions-success');
                this.navCtrl.setRoot(TransactionsPage);
                
              }, 
              err => {
                this.messageProvider.displayErrorMessage('message-new-two-transaction-error');
              }
            );
        }, 
        err => {
          this.messageProvider.displayErrorMessage('message-new-two-transaction-error');
        }
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public typeChange(value) {
    if (value == 'transfer') {
      this.isTransfer = true;
      this.newTransaction.category = this.categoryProvider.mappedCategoriesByName['Transfer']._id;
    }
    if (value == 'expense') {
      this.isTransfer = false;
      this.newTransaction.category = this.categoryProvider.mappedCategoriesByName['Living']._id;
    }
    if (value == 'income') {
      this.isTransfer = false;
      this.newTransaction.category = this.categoryProvider.mappedCategoriesByName['Wage']._id;
    }
  }

  public accountChange(value) {
    this.newTransaction.currency = this.accountProvider.mappedAccountsById[value].currency
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

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
          break;
      }
    }, this);
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public format(valString) {
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

}
