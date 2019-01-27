import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UserModel } from '../../models/user/user';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

	public user: UserModel;

  constructor(
    public http: HttpClient, 
    public storage: Storage
    ) 
  {

  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Observable use object                                                                                            */

  // public subscribeToUserProvider(callback) {
  //   return this._user.subscribe(callback);
  // }

  public updateUserProvider(user: UserModel) {
    // this._user.next(user);
    this.user = user;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* User storage management                                                                                          */

  /**
   * Write user properties in the local storage.
   *
   * @param user
   * @returns {Promise<UserModel>}
   */
  createOnStorage(user: UserModel): Promise<UserModel> {
    return new Promise((resolve) => {
      this.getOnStorage().then((res) => {
        if (res) {
          this.deleteOnStorage().then(() => {

          });
        }
      }).then(() => {
        this.updateUserProvider(user);
        this.storage.set('user', JSON.stringify(user));
        resolve(user);
      });
    });
  }

  /**
   * Get user properties from local storage.
   *
   * @returns {Promise<UserModel>}
   */
  getOnStorage(): Promise<UserModel> {
    return new Promise((resolve) => {
    	this.storage.get('user').then((user) => {
    		this.updateUserProvider(JSON.parse(user));
    		resolve(this.storage.get('user'));
			})
		});
  }

  /**
   * Get user properties from local storage.
   *
   * @returns {Promise<UserModel>}
   */
  getOnStorageSync() {
  	this.storage.get('user').then((user) => {
  		this.updateUserProvider(JSON.parse(user));
  		return this.storage.get('user');
  	})
  }

  /**
   * Update user properties from local storage.
   *
   * @param user
   * @returns {Promise<UserModel>}
   */
  updateOnStorage(user: UserModel): Promise<UserModel> {
    return new Promise((resolve) => {
      this.storage.set('user', JSON.stringify(user))
      this.updateUserProvider(user);
      resolve(user);
    });
  }

  /**
   * Delete user properties from local storage.
   *
   * @returns {Promise<UserModel>}
   */
  deleteOnStorage(): Promise<UserModel> {
    return new Promise((resolve) => {
      this.storage.remove('user');
      resolve();
    });
  }

}