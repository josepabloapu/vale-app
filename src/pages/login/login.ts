import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
import { MessageProvider } from '../../providers/message/message';
import { ApiProvider } from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public userData: Object;
  private loading: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: Storage,
    public translateService: TranslateService,
    public messageProvider: MessageProvider, 
    public apiProvider: ApiProvider,  
    public userProvider: UserProvider) 
  {
    this.userData = { username: "", password: "" };
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  public login() {

    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });

    this.loading.present().then(() => {
      this.userProvider.login(this.userData)
        .then(
          res => {
            let user = UserModel.ParseFromObject(res);
            this.userProvider.setLocalUser(user).then( user => {
              this.apiProvider.setToken(user.token);
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