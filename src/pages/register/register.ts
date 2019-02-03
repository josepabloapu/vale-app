import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
import { CurrencyModel } from '../../models/currency/currency';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { CurrencyProvider } from '../../providers/currency/currency';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public newUser: UserModel;
  public currencies: CurrencyModel [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translateService: TranslateService,
    private messageProvider: MessageProvider, 
    private userProvider: UserProvider, 
    private currencyProvider: CurrencyProvider) 
  {
    this.settCurrencies(this.currencyProvider.currencies);
    this.newUser = UserModel.GetNewInstance();
    this.newUser.currency = this.currencies[0]._id;
    this.newUser.language = 'en';
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RegisterPage');
  }

  private settCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  public login() {
    this.navCtrl.push(LoginPage, { }, { animate: false });
  }

  public register() {
    this.userProvider.register(this.newUser).then((result) => {
      this.messageProvider.displaySuccessMessage('message-new-user-success')
      this.navCtrl.push(LoginPage, { }, { animate: false });
    }, (err) => {
      this.messageProvider.displayErrorMessage('message-new-user-error')
    });
  }

  public changeLanguage(value) {
    this.newUser.language = value;
    this.translateService.use(value);
  }

}
