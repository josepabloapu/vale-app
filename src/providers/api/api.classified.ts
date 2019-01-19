import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TokenProvider } from '../../providers/token/token';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private BASE_URL: string;
  private API_KEY: string;
  private AUTH_TOKEN: string;

  constructor(private http: HttpClient, private tokenProvider: TokenProvider) {
    this.BASE_URL = "https://example.com/api";
    this.API_KEY = "secret-key";
    this.tokenProvider.getToken().then((token) => {
      this.AUTH_TOKEN = token;
    });
  }

  /**
   * Get the required headers: Json Web Token and the API-key.
   *
   * @returns {{}}
   */
  private createHeaders(auth) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'API-Key': this.API_KEY
      })
    }
    if (auth) httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + this.AUTH_TOKEN)
    return httpOptions
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  /**
   * Perform a POST request.
   *
   * @param url
   * @param auth
   * @param body
   * @returns {Observable<>}
   */
  public postRequest(url: string, body: Object, auth: boolean = true): Observable<Object> {
    // console.log("api/postHeader");
    let headers = null;
    headers = this.createHeaders(auth);
    return this.http.post(this.BASE_URL + url, body, headers)
  }

  /**
   * Perform a GET request.
   *
   * @param url
   * @param auth
   * @returns {Promise<>}
   */
  public getRequest(url: string, auth: boolean = true): Observable<Object> {
    let headers = null
    headers = this.createHeaders(auth);
    return this.http.get(this.BASE_URL + url, headers)
  }

  /**
   * Perform a PUT request.
   *
   * @param url
   * @param auth
   * @param body
   * @returns {Observable<>}
   */
  public putRequest(url: string, body: Object, auth: boolean = true): Observable<Object> {
    let headers = null
    headers = this.createHeaders(auth)
    return this.http.put(this.BASE_URL + url, body, headers)
  }

  /**
   * Perform a DELETE request.
   *
   * @param url
   * @param auth
   * @returns {Observable<>}
   */
  public deleteRequest(url: string, auth: boolean = true): Observable<Object> {
    let headers = null
    headers = this.createHeaders(auth);
    return this.http.delete(this.BASE_URL + url, headers)
  }

}
