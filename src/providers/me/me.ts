import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserModel } from '../../models/user/user';

import { ApiProvider } from '../../providers/api/api';

/*
  Generated class for the MeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MeProvider {

	public user: UserModel;

  constructor(public http: HttpClient, public apiProvider: ApiProvider) {
    console.log('Hello MeProvider Provider');
    // console.log({ME: this})
  }

  public updateUserProvider(user: UserModel) {
    this.user = user;
  }

 	public getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/users/me', true)
        .subscribe(
          res => {
            this.updateUserProvider(UserModel.ParseFromObject(res));
            resolve(UserModel.ParseFromObject(res));
          },
          err => reject(<any>err));
    });
  }

  public updateUser(user) {
    return new Promise((resolve, reject) => {
      this.apiProvider.putRequest('/users/me', user, true)
        .subscribe(
          res => {
            this.getUser();
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  // public deleteUser(user): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.apiProvider.deleteRequest('/users/' + user._id, true)
  //       .subscribe(
  //         res => {
  //           this.getUsers();
  //           resolve(<any>res);
  //         },
  //         err => reject(<any>err));
  //   });
  // }

}
