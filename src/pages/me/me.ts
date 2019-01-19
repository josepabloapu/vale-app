import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { UserModel } from '../../models/user/user';

import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { CurrencyProvider } from '../../providers/currency/currency';

import { WelcomePage } from '../../pages/welcome/welcome';
import { EditUserPage } from '../../pages/edit-user/edit-user';

/**
 * Generated class for the MePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
})
export class MePage {

  public user: UserModel;

  constructor(
    public app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private translateService: TranslateService,
    public userProvider: UserProvider,
    public currencyProvider: CurrencyProvider, 
    public authProvider: AuthProvider) 
  {
    this.getAuthUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MePage');
  }

  editUser() {
    this.navCtrl.push(EditUserPage, { }, { animate: false });
  }

  logout() {
  	this.authProvider.logout();
    this.app.getRootNav().setRoot(WelcomePage);
  }

  getAuthUser() {
    this.user = this.userProvider.user
  }

  getCurrencyReadableName(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  changeLanguage() {
    this.translateService.use(this.userProvider.user.language);
  }

  changeCurrency() {
    
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
