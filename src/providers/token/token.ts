import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LocalTokenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenProvider {

	public token: string;

  constructor(private http: HttpClient, private storage: Storage) {
    this.getToken();
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  /**
   * Write token in the local storage.
   *
   * @param token
   * @returns {Promise<string>}
   */
  public setToken(token: string): Promise<string> {
    return new Promise((resolve) => {
      this.getToken().then((res) => {
        if (res) {
          this.removeToken().then(() => {

          });
        }
      }).then(() => {
        this.storage.set('token', token);
        this.token = token;
        resolve();
      });
    });
  }

  /**
   * Get token from local storage.
   *
   * @returns {Promise<string>}
   */
  public getToken(): Promise<string> {
    return new Promise((resolve) => {
      this.storage.get('token').then((token) => {
        this.token = token;
        resolve(token);
      })
    });
  }

  /**
   * Delete token from local storage.
   *
   * @returns {Promise<string>}
   */
  public removeToken(): Promise<string> {
    return new Promise((resolve) => {
      this.storage.remove('token');
      resolve();
    });
  }

}
