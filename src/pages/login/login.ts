import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MessageProvider } from '../../providers/message/message';
import { TokenProvider } from '../../providers/token/token';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { MeProvider } from '../../providers/me/me';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loading: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private messageProvider: MessageProvider,
    public tokenProvider: TokenProvider, 
    public apiProvider: ApiProvider, 
    public authProvider: AuthProvider, 
    public userProvider: UserProvider,
    public meProvider: MeProvider) 
  {
    this.loading = this.loadingCtrl.create({
      content: 'Logging in'
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  userData = { username: "", password: "" };

  login() {
    this.loading.present().then(() => {
      this.authProvider.login(this.userData)
        .then(
          user => {
            this.storage.set('user', JSON.stringify(user));
            this.tokenProvider.setToken(user.token);
            this.meProvider.updateUserProvider(user);
            this.apiProvider.updateApiProviderToken(user.token);
            this.loading.dismiss();
            this.navCtrl.push(TabsPage, { }, { animate: false });
          }, 
          err => {
            this.loading.dismiss();
            this.messageProvider.displayErrorMessage('message-loggin-error');
          }
        );
    });
  }

  register() {
    this.navCtrl.push(RegisterPage, { }, { animate: false });
  }

}