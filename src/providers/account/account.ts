import { Injectable } from '@angular/core';
import { AccountModel } from '../../models/account/account';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class AccountProvider {

  public accounts: AccountModel [];
  public mappedAccountsById: {};
  public mappedAccountsByName: {};
  public currentAccount: AccountModel;

  constructor(private apiProvider: ApiProvider) {
    this.getAccounts();
    // console.log({PROVIDER_ACCOUNT: this})
  }

  public updateAccountProvider(accounts: AccountModel []) {
    this.accounts = accounts;
    this.updateMappedAccounts(this.accounts);
  }

  private updateMappedAccounts(array) {
    this.mappedAccountsById = {}
    this.mappedAccountsByName = {}

    var self = this;
    array.forEach(function(element) {
      self.mappedAccountsById[element._id] = element;
      self.mappedAccountsByName[element.name] = element;
    });
  }

  public updateCurrentAccount(account: AccountModel) {
    this.currentAccount = account
  }

  public createAccount(account: object) {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/accounts', account, true)
        .subscribe(
          res => {
            this.getAccounts().then( res => {
              resolve(<any>res);
            });
          },
          err => reject(<any>err));
    });
  }

  public getAccounts(): Promise<any> {
  	return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/accounts', true)
        .subscribe(
          res => {
            this.updateAccountProvider(AccountModel.ParseFromArray(res));
            resolve(AccountModel.ParseFromArray(res));
          },
          err => reject(<any>err));
    });
  }

  public updateAccount(account) 
  {
    return new Promise((resolve, reject) => {
      this.apiProvider.putRequest('/accounts/' + account._id, account, true)
        .subscribe(
          res => {
            this.getAccounts();
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  public deleteAccount(account: AccountModel): Promise<any> 
  {
    return new Promise( (resolve, reject) => {
      this.apiProvider.deleteRequest('/accounts/' + account._id, true)
      .subscribe(
        res => {
          this.getAccounts();
          resolve(<any>res);
        }, err => {
          reject(<any>err)
        }
      );
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Danger zone */

  public async removeAllAccounts() 
  {
    let accounts: AccountModel[] = await this.getAccounts();
    let counter: number = 1;
    let counterEnd: number = accounts.length;
    let progress: number = 0;

    for (let account of accounts) 
    {
      progress = counter / counterEnd * 100;
      this.broadcastProgress(progress);
      await this.deleteAccount(account);
      counter++;
    }

    return new Promise((resolve) => { resolve(); });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Support functions */

  private broadcastProgress(value) 
  {
    console.log(value)
    // this.exportProvider.progress = value;
  }

}
