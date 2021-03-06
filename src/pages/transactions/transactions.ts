import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { TransactionModel } from '../../models/transaction/transaction'
import { AccountModel } from '../../models/account/account'
import { CategoryModel } from '../../models/category/category'
import { MessageProvider } from '../../providers/message/message'
import { TransactionProvider } from '../../providers/transaction/transaction'
import { CategoryProvider } from '../../providers/category/category'
import { CurrencyProvider } from '../../providers/currency/currency'
import { AccountProvider } from '../../providers/account/account'
import { NewTransactionPage } from '../../pages/new-transaction/new-transaction'
import { EditTransactionPage } from '../../pages/edit-transaction/edit-transaction'

@IonicPage()
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  public categories: CategoryModel []
  public accounts: AccountModel []
  public transactions: TransactionModel []
  public timeZoneOffset: string
  private loading: any
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private messageProvider: MessageProvider, 
    private categoryProvider: CategoryProvider,
    private currencyProvider: CurrencyProvider,
    private accountProvider: AccountProvider,
    public transactionProvider: TransactionProvider) 
  {
    this.timeZoneOffset = String(new Date().getTimezoneOffset() / 60 * 100)
    this.getCategories()
    this.getAccounts()

    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
      this.loading.present().then(() => {
        this.getTransactions().then( res => {
          this.loading.dismiss()
        })
      })
    })

    // console.log({TRANSACTION_PAGE: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TransactionsPage')
  }

  ionViewWillEnter() {
    this.getTransactions()
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public updateAccounts(accounts: AccountModel []) {
    this.accounts = accounts
  }

  private getAccounts() {
    this.accountProvider.getAccounts().then(res => {
        this.updateAccounts(AccountModel.ParseFromArray(res))
      }, err => {
        this.messageProvider.displaySuccessMessage('message-get-accounts-error')
      }
    )
  }

  private updateTransactions(transactions: TransactionModel []) {
    this.transactions = transactions
  }

  private getTransactions() {
    return new Promise((resolve) => {
      this.transactionProvider.getTransactions().then(res => {
        resolve()
        this.updateTransactions(TransactionModel.ParseFromArray(res))
      }, err => {
        resolve(err)
        this.messageProvider.displaySuccessMessage('message-get-transactions-error')
      })
    })
  }

  private updateCategories(categories: CategoryModel []) {
    this.categories = categories
  }

  private getCategories() {
    this.categoryProvider.getCategories().then(res => {
      this.updateCategories(CategoryModel.ParseFromArray(res))
    }, err => {
      this.messageProvider.displaySuccessMessage('message-get-categories-error')
    })
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Functions to be used with transactions page */

  public createTransaction() {
    this.navCtrl.push(NewTransactionPage, { }, { animate: false })
  }

  public editTransaction(transaction: TransactionModel) {
    this.transactionProvider.updateCurrentTransaction(transaction)
    this.navCtrl.push(EditTransactionPage, { }, { animate: false })
  }

  public deleteTransaction(transaction: TransactionModel) {
    this.transactionProvider.deleteTransaction(transaction).then(res => {
      this.getTransactions()
      this.messageProvider.displaySuccessMessage('message-delete-transaction-success')
    }, err => {
      this.messageProvider.displayErrorMessage('message-delete-transaction-error')
    })
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Functions to be used with angular expressions */

  public getCategoryReadableObject(id: string = '') {
    return this.categoryProvider.mappedCategoriesById[id]
  }

  public getAccountReadableObject(id: string = '') {
    return this.accountProvider.mappedAccountsById[id]
  }

  public getCurrencyReadableObject(id: string = '') {
    return this.currencyProvider.mappedCurrenciesById[id]
  }

}
