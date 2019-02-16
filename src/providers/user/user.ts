import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserModel } from '../../models/user/user';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class UserProvider {

  public user: UserModel

  constructor(public http: HttpClient, public apiProvider: ApiProvider, private storage: Storage) {
    // console.log({PROVIDER_USER: this})
  }

  private setUser(user: UserModel) {
    this.user = user;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public async setLocalUser(user: UserModel): Promise<any> {
    await this.storage.set('user', JSON.stringify(user));
    await this.setUser(user);
    return new Promise((resolve) => {
      resolve(user);
    });
  }

  public getLocalUser(): Promise<UserModel> {
    return new Promise((resolve) => {
      this.storage.get('user').then((value) => {
        let user = JSON.parse(value);
        this.setUser(user);
        resolve(user);
      })
    });
  }

  public removeLocalUser(): Promise<string> {
    return new Promise((resolve) => {
      this.storage.remove('user');
      this.setUser(null);
      resolve();
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

 	public getRemoteUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/users/me', true)
        .subscribe(
          res => {
            let user = UserModel.ParseFromObject(res);
            this.setLocalUser(user);
            resolve(user);
          },
          err => reject(<any>err));
    });
  }

  public updateRemoteUser(user) {
    return new Promise((resolve, reject) => {
      this.apiProvider.putRequest('/users/me', user, true)
        .subscribe(
          res => {
            let user = UserModel.ParseFromObject(res);
            this.setLocalUser(user).then( user => {
              resolve(user);
            });
          },
          err => reject(<any>err));
    });
  }

  public deleteRemoteUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.deleteRequest('/users/me', true)
        .subscribe(
          res => {
            this.removeLocalUser();
            resolve(<any>res);
          },
          err => reject(<any>err));
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public register(user: object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/auth/register', user, false)
        .subscribe(
          res => resolve(res),
          err => reject(err));
    });
  }

  public login(user: object): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/auth/login', user, false)
        .subscribe(
          res => resolve(UserModel.ParseFromObject(res)),
          error => reject(<any>error));
    });
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/auth/logout', null, true)
        .subscribe(
          res => {
            this.removeLocalUser()
            resolve(<any>res)
          },
          error => reject(<any>error));
    });
  }

}
