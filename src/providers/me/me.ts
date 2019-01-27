import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserModel } from '../../models/user/user';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class MeProvider {

	public user: UserModel;

  constructor(public http: HttpClient, public apiProvider: ApiProvider, private storage: Storage) {
    // console.log({PROVIDER_ME: this})
  }

  public updateUserProvider(user: UserModel) {
    this.user = user;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  /**
   * Write user in the local storage.
   *
   * @param user
   * @returns {Promise<UserModel>}
   */
  public setLocalUser(user: UserModel): Promise<UserModel> {
    return new Promise((resolve) => {
      this.getLocalUser().then((res) => {
        if (res) {
          this.removeLocalUser().then(() => {

          });
        }
      }).then(() => {
        // console.log("saving user: " + user)
        this.updateUserProvider(user);
        this.storage.set('user', JSON.stringify(user));
        resolve(user);
      });
    });
  }

  /**
   * Get user from local storage.
   *
   * @returns {Promise<UserModel>}
   */
  public getLocalUser(): Promise<UserModel> {
    return new Promise((resolve) => {
      this.storage.get('user').then((value) => {
        let user = JSON.parse(value);
        this.user = user;
        resolve(user);
      })
    });
  }

  /**
   * Delete user from local storage.
   *
   * @returns {Promise<string>}
   */
  public removeLocalUser(): Promise<string> {
    return new Promise((resolve) => {
      this.storage.remove('user');
      resolve();
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

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
