import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
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
  private userData: Object;

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
    this.userData = { username: "", password: "" };
    this.translateService.get('logging-in').subscribe( value => this.loading = this.loadingCtrl.create({ content: value }));
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  public login() {
    this.loading.present().then(() => {
      this.authProvider.login(this.userData)
        .then(
          res => {
            let user = UserModel.ParseFromObject(res);
            this.meProvider.setLocalUser(user).then( user => {
              this.tokenProvider.setToken(user.token);
              this.apiProvider.updateApiProviderToken(user.token);
              this.loading.dismiss();
              this.navCtrl.push(TabsPage, { }, { animate: false });
            })
          }, 
          err => {
            this.loading.dismiss();
            this.messageProvider.displayErrorMessage('message-loggin-error');
          }
        );
    });
  }

  public register() {
    this.navCtrl.push(RegisterPage, { }, { animate: false });
  }

}