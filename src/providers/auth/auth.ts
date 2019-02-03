import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserModel } from '../../models/user/user';
import { ApiProvider } from '../../providers/api/api';
import { MeProvider } from '../../providers/me/me';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient, private meProvider: MeProvider, private apiProvider: ApiProvider) {
    // console.log({PROVIDER_AUTH: this})
  }

  /**
   * Request an authentication access.
   *
   * @param email the email of the user
   * @param password the password of the user
   * @returns {Promise<any>}
   */
  register(user: object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/auth/register', user, false)
        .subscribe(
          res => resolve(res),
          err => reject(err));
    });
  }

  /**
   * Request an authentication access.
   *
   * @param email the email of the user
   * @param password the password of the user
   * @returns {Promise<any>}
   */
  login(user: object): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/auth/login', user, false)
        .subscribe(
          res => resolve(UserModel.ParseFromObject(res)),
          error => reject(<any>error));
    });
  }

  /**
   * Logout a user from the authentication process.
   *
   * @returns {Promise<any>}
   */
  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.postRequest('/auth/logout', null, true)
        .subscribe(
          res => {
            this.meProvider.removeLocalUser()
            resolve(<any>res)
          },
          error => reject(<any>error));
    });
  }


  /**
   * Check whether a user is already logged in.
   *
   * @returns {boolean}
   */
  verifyToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/auth/verifyToken', true)
        .subscribe(
          res => resolve(<any>res),
          error => reject(<any>error));
    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  // postData(credentials, url) {
  //   return new Promise((resolve, reject) => {
  //     let headers = new HttpHeaders();
  //     headers = headers.set('API-Key', api.key)
  //     this.http.post(api.url + url, credentials, {headers: headers}).
  //     subscribe(res => {
  //     	resolve(res);
  //     }, (err) => {
  //     	reject(err);
  //     });
  //   });
  // }

}