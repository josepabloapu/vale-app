import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiProvider } from '../../providers/api/api';

import { AccountTypeModel } from '../../models/account-type/account-type';

/*
  Generated class for the AccountTypeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountTypeProvider {

  public accountTypes: AccountTypeModel [];
  public mappedAccountTypesById: {};
  public mappedAccountTypesByCode: {};

  constructor(public http: HttpClient, private apiProvider: ApiProvider) {
    this.getAccountTypes();
  }

  public updateAccountTypeProvider(accountTypes: AccountTypeModel []) {
    this.accountTypes = accountTypes;
    this.updateMappedAccountTypes(this.accountTypes);
  }

  private updateMappedAccountTypes(array) {
    this.mappedAccountTypesById = {}
    array.forEach(function(element) {
      this.mappedAccountTypesById[element._id] = element
    }, this);
    this.mappedAccountTypesByCode = {}
    array.forEach(function(element) {
      this.mappedAccountTypesByCode[element.code] = element
    }, this);
  }

  public getAccountTypes(): Promise<any> {
  	return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/accountTypes', false)
        .subscribe(
          res => {
            this.updateAccountTypeProvider(AccountTypeModel.ParseFromArray(res));
            resolve(AccountTypeModel.ParseFromArray(res));
          },
          err => reject(<any>err));
    });
  }

}
