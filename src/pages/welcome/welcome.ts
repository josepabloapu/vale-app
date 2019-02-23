import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  private loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: Storage, 
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    public messageProvider: MessageProvider,
    public userProvider: UserProvider,
    public apiProvider: ApiProvider,
    public currencyProvider: CurrencyProvider,
    public categoryProvider: CategoryProvider) 
  {
    this.translateService.use('en');

    var self = this;
    setTimeout(function() {
      self.tryToLogin();
    }, 1000);
    // console.log({WELCOME_PAGE: this});
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WelcomePage');
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public login(){
    this.navCtrl.push(LoginPage, { }, { animate: false });
  }

  public register(){
    this.navCtrl.push(RegisterPage, { }, { animate: false });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private tryToLogin() {
    this.userProvider.getLocalUser().then((user: UserModel) => {
      if (user == null) return 0;
      if (user.token == null) return 0;
      this.verifyToken(user.token);
    });
  }

  private verifyToken(token: string) {

    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });

    this.loading.present().then(() => {
      this.apiProvider.verifyToken(token)
        .then(
          res => {
            this.loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
          }, 
          err => {
            this.loading.dismiss();
            if (err.status == 401) this.navCtrl.push(LoginPage);
          }
        );
    });
  }

}
