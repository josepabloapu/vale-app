import { Injectable } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { TransactionModel } from '../../models/transaction/transaction';

@Injectable()
export class TransactionProvider {

  public transactions: TransactionModel [];
  public currentTransaction: TransactionModel;

  constructor(private apiProvider: ApiProvider){
    // console.log({ PROVIDER_TRANSACTION: this });
  }

  public updateTransactionProvider(transactions: TransactionModel []) {
    this.transactions = transactions;
  }

  public updateCurrentTransaction(transaction: TransactionModel) {
    this.currentTransaction = transaction
  }

  public createTransaction(transaction: object) {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/transactions', transaction, true)
        .subscribe(
          res => {
            this.getTransactions();
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  public createTransactionFromImportRoutine(transaction: object) {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/transactions', transaction, true)
        .subscribe(
          res => {
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  public getAllTransactions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/transactions-all', true)
        .subscribe(
          res => {
            this.updateTransactionProvider(TransactionModel.ParseFromArray(res));
            resolve(TransactionModel.ParseFromArray(res));
          },
          err => reject(<any>err));
    });
  }

  public getTransactions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/transactions', true)
        .subscribe(
          res => {
            this.updateTransactionProvider(TransactionModel.ParseFromArray(res));
            resolve(TransactionModel.ParseFromArray(res));
          },
          err => reject(<any>err));
    });
  }

  public updateTransaction(transaction) {
    return new Promise((resolve, reject) => {
      this.apiProvider.putRequest('/transactions/' + transaction._id, transaction, true)
        .subscribe(
          res => {
            this.getTransactions();
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  public deleteTransaction(transaction): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.deleteRequest('/transactions/' + transaction._id, true)
        .subscribe(
          res => {
            this.getTransactions();
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  public deleteTransactionFromImportRoutine(transaction): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.deleteRequest('/transactions/' + transaction._id, true)
        .subscribe(
          res => {
            resolve(<any>res);
          },
          err => {
            reject(<any>err)
          });
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Danger zone */

  public async removeAllTransactions() 
  {
    let transactions: TransactionModel[] = await this.getAllTransactions()
    let counter: number = 1;
    let counterEnd: number = transactions.length;
    let progress: number = 0;

    for (let transaction of transactions) 
    {
      progress = counter / counterEnd * 100;
      this.broadcastProgress(progress);
      await this.deleteTransactionFromImportRoutine(transaction)
      counter++;
    }

    return new Promise((resolve) => 
    {
      resolve();
    })
  }

  private broadcastProgress(value) 
  {
    console.log(value)
    // this.exportProvider.progress = value;
  }

}
