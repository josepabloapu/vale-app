import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MessageProvider } from '../../providers/message/message';
import { TokenProvider } from '../../providers/token/token';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { MeProvider } from '../../providers/me/me';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loading: any;
  private userData: {};

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public translateService: TranslateService,
    public messageProvider: MessageProvider,
    public tokenProvider: TokenProvider, 
    public apiProvider: ApiProvider, 
    public authProvider: AuthProvider, 
    public meProvider: MeProvider) 
  {
    var self = this;

    self.userData = { username: "", password: "" };
    self.translateService.get('logging-in').subscribe( value => self.loading = self.loadingCtrl.create({ content: value }));
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }


  private login() {
    var self = this;

    self.loading.present().then(() => {
      self.authProvider.login(self.userData)
        .then(
          user => {
            self.storage.set('user', JSON.stringify(user));
            self.tokenProvider.setToken(user.token);
            self.meProvider.updateUserProvider(user);
            self.apiProvider.updateApiProviderToken(user.token);
            self.loading.dismiss();
            self.navCtrl.push(TabsPage, { }, { animate: false });
          }, 
          err => {
            self.loading.dismiss();
            self.messageProvider.displayErrorMessage('message-loggin-error');
          }
        );
    });
  }

  private register() {
    var self = this;
    
    self.navCtrl.push(RegisterPage, { }, { animate: false });
  }

}