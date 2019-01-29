import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { MessageProvider } from '../../providers/message/message';
import { TokenProvider } from '../../providers/token/token';
import { MeProvider } from '../../providers/me/me';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrencyProvider } from '../../providers/currency/currency';

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
    public storage: Storage, 
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    public messageProvider: MessageProvider,
    public tokenProvider: TokenProvider,
    public meProvider: MeProvider,
    public authProvider: AuthProvider, 
    public currencyProvider: CurrencyProvider) 
  {
    var self = this;

    self.translateService.use('en');
    self.translateService.get('logging-in').subscribe( value => self.loading = self.loadingCtrl.create({ content: value }));
    self.tryToLogin();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WelcomePage');
  }

  private login(){
    this.navCtrl.push(LoginPage, { }, { animate: false });
  }

  private register(){
    this.navCtrl.push(RegisterPage, { }, { animate: false });
  }

  private tryToLogin() {
    var self = this;
    self.storage.get('user').then((value) => {
      if (value == null) return 0;
      let user = UserModel.ParseFromObject(JSON.parse(value));
      self.meProvider.setLocalUser(user);
      self.verifyToken();
    });
  }

  private verifyToken() {
    var self = this;

    self.loading.present().then(() => {
      self.authProvider.verifyToken()
        .then(
          res => {
            self.loading.dismiss();
            self.navCtrl.setRoot(TabsPage);
          }, 
          err => {
            self.loading.dismiss();
            if (err.status == 401) self.navCtrl.push(LoginPage);
          }
        );
    });
  }

}
