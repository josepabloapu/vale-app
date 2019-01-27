import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { UserModel } from '../../models/user/user';
import { CurrencyModel } from '../../models/currency/currency';

import { MessageProvider } from '../../providers/message/message';
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
  	private translateService: TranslateService,
    private messageProvider: MessageProvider,
  	public userProvider: UserProvider,
    public meProvider: MeProvider,
  	public accountProvider: AccountProvider,
    public currencyProvider: CurrencyProvider) 
  {
  	this.loadCurrencies();
  	this.loadUser();
    // console.log({PAGE_EDITUSER: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditUserPage');
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
    this.updateUserProvider(this.meProvider.user);
  }

  private updateUser() {
    this.meProvider.updateUser(this.editUser)
    .then(
        res => {
          this.navCtrl.setRoot(MePage);
          this.messageProvider.displaySuccessMessage('message-update-user-success')
        }, 
        err => this.messageProvider.displayErrorMessage('message-update-user-error')
      );
  }

  public changeLanguage(value) {
    this.editUser.language = value;
    this.translateService.use(value);
  }

}
