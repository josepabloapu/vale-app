import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { UserModel } from '../../models/user/user';
import { CurrencyModel } from '../../models/currency/currency';

import { MessageProvider } from '../../providers/message/message';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrencyProvider } from '../../providers/currency/currency';

import { LoginPage } from '../login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private newUser: UserModel;
  private currencies: CurrencyModel [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translateService: TranslateService,
    private messageProvider: MessageProvider, 
    private authProvider: AuthProvider, 
    private currencyProvider: CurrencyProvider) 
  {
    this.loadCurrencies();
    this.newUser = UserModel.GetNewInstance();
    this.newUser.currency = this.currencies[0]._id;
    this.newUser.language = 'en';
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RegisterPage');
  }

  

  private updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private loadCurrencies() {
    this.updateCurrencies(this.currencyProvider.currencies);
  }

  login() {
    this.navCtrl.push(LoginPage, { }, { animate: false });
  }

  register() {
    this.authProvider.register(this.newUser).then((result) => {
      this.messageProvider.displaySuccessMessage('message-new-user-success')
      this.navCtrl.push(LoginPage, { }, { animate: false });
    }, (err) => {
      this.messageProvider.displayErrorMessage('message-new-user-error')
    });
  }

  changeLanguage(value) {
    this.newUser.language = value;
    this.translateService.use(value);
  }

}
