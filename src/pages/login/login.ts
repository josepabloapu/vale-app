import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

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
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
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
    console.log('ionViewDidLoad LoginPage');
  }

  userData = { username: "", password: "" };

  login() {
    this.loading.present().then(() => {
      this.authProvider.login(this.userData)
        .then(
          result => {
            this.userProvider.createOnStorage(result);
            this.meProvider.updateUserProvider(result);
            this.tokenProvider.setToken(result.token).then(
              res => {
                this.loading.dismiss();
                this.navCtrl.push(TabsPage, { }, { animate: false });
              }
            );
          }, 
          err => {
            this.loading.dismiss();
            this.presentToast(err.error.message.message)
          }
        );
    });
  }

  register() {
    this.navCtrl.push(RegisterPage, { }, { animate: false });
  }

  presentToast(message) {

  	let toast = this.toastCtrl.create({
  	  message: message,
  	  duration: 1500,
  	  position: 'bottom'
  	});

  	toast.onDidDismiss(() => {
  	  console.log('Dismissed toast');
  	});

  	toast.present();

	}

}