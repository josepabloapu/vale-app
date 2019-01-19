import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';

import { UserModel } from '../../models/user/user';
import { CurrencyModel } from '../../models/currency/currency';

import { UserProvider } from '../../providers/user/user';
import { MeProvider } from '../../providers/me/me';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';

import { MePage } from '../../pages/me/me';

/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

	public editUser: UserModel;
	public currencies: CurrencyModel [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private toastCtrl: ToastController,
  	private translateService: TranslateService,
  	public userProvider: UserProvider,
    public meProvider: MeProvider,
  	public accountProvider: AccountProvider,
    public currencyProvider: CurrencyProvider) 
  {
  	this.loadCurrencies();
  	this.loadUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPage');
  }

  private updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  public loadCurrencies() {
    this.updateCurrencies(this.currencyProvider.currencies);
  }

  private updateUserProvider(user: UserModel) {
    this.editUser = user;
  }

  public loadUser() {
    this.updateUserProvider(this.userProvider.user);
  }

  private updateUser(user: UserModel) {
    this.meProvider.updateUser(user)
    .then(
        res => {
          this.userProvider.updateUserProvider(this.editUser);
          this.navCtrl.setRoot(MePage);
          this.presentToast('user-has-been-updated');
        }, 
        err => this.presentToast(err.error.mmesage.message)
      );
  }

  public changeLanguage(value) {
    this.editUser.language = value;
    this.translateService.use(value);
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
