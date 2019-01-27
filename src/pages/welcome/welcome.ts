import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserModel } from '../../models/user/user';

import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

import { TokenProvider } from '../../providers/token/token';
import { MeProvider } from '../../providers/me/me';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrencyProvider } from '../../providers/currency/currency';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  private loading: any;
  private token: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage, 
    public loadingCtrl: LoadingController,
    private tokenProvider: TokenProvider,
    private meProvider: MeProvider,
    private authProvider: AuthProvider, 
    private currencyProvider: CurrencyProvider) 
  {
    this.loading = this.loadingCtrl.create({ content: 'Logging in' });
    this.getUser();
    // console.log({PAGE_WELCOME: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WelcomePage');
  }

  login(){
    this.navCtrl.push(LoginPage, { }, { animate: false });
  }

  register(){
    this.navCtrl.push(RegisterPage, { }, { animate: false });
  }

  private getUser() {
    this.storage.get('user').then((value) => {
      if (value == null) return 0;
      let user = UserModel.ParseFromObject(JSON.parse(value));
      this.meProvider.setLocalUser(user);
      this.verifyToken();
    });
  }

  private verifyToken() {
    this.loading.present().then(() => {

      this.authProvider.verifyToken()
        .then(
          res => {
            this.loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
          }, 
          err => {
            this.loading.dismiss();
            this.navCtrl.push(LoginPage, { }, { animate: false });
          }
        );

    });
  }

}
