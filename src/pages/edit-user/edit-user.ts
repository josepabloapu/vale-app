import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
import { CurrencyModel } from '../../models/currency/currency';
import { AuthProvider } from '../../providers/auth/auth';
import { MessageProvider } from '../../providers/message/message';
import { MeProvider } from '../../providers/me/me';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { ExportProvider } from '../../providers/export/export';
import { WelcomePage } from '../../pages/welcome/welcome';
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
  public tempUser: UserModel;
	public currencies: CurrencyModel [];

  constructor(
    public app: App,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private translateService: TranslateService,
    private messageProvider: MessageProvider,
    public authProvider: AuthProvider,
    public meProvider: MeProvider,
  	public accountProvider: AccountProvider,
    public currencyProvider: CurrencyProvider,
    public exportProvider: exportProvider) 
  {
  	this.loadCurrencies();
  	this.loadUser();
    // console.log({PAGE_EDITUSER: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditUserPage');
  }

  public loadCurrencies() {
    this.updateCurrencies(this.currencyProvider.currencies);
  }

  public loadUser() {
    this.updateUserProvider(this.meProvider.user);
  }

  private updateCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private updateUserProvider(user: UserModel) {
    this.editUser = user;
    this.tempUser = UserModel.GetNewInstance();
    this.tempUser.name = this.editUser.name;
    this.tempUser.email = this.editUser.email;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private changeName(value) {
    this.editUser.name = value;
    if (this.editUser.name != this.tempUser.name) this.updateUser();
  }

  private changeEmail(value) {
    this.editUser.email = value;
    if (this.editUser.email != this.tempUser.email) this.updateUser();
  }

  public changeLanguage(value) {
    this.editUser.language = value;
    this.translateService.use(value);
    this.updateUser();
  }

  public changeCurrency(value) {
    this.editUser.currency = value;
    this.updateUser();
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private updateUser() {
    this.meProvider.setLocalUser(this.editUser)
    .then(
        res => {
          this.messageProvider.displaySuccessMessage('message-update-user-success')
          this.loadUser();
          // this.navCtrl.setRoot(MePage);
        }, 
        err => this.messageProvider.displayErrorMessage('message-update-user-error')
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  logout() {
    this.authProvider.logout().then( promise => {
      this.app.getRootNav().setRoot(WelcomePage);
    });
  }

}
