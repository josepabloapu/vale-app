import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../../models/user/user';
import { CurrencyModel } from '../../models/currency/currency';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { AccountProvider } from '../../providers/account/account';
import { CurrencyProvider } from '../../providers/currency/currency';
import { ExportProvider } from '../../providers/export/export';
import { WelcomePage } from '../../pages/welcome/welcome';

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
    public userProvider: UserProvider,
  	public accountProvider: AccountProvider,
    public currencyProvider: CurrencyProvider,
    public exportProvider: ExportProvider) 
  {
  	this.setCurrencies(this.currencyProvider.currencies);
  	this.setUser(this.userProvider.user);
    // console.log({PAGE_EDITUSER: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditUserPage');
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private setCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies;
  }

  private setUser(user: UserModel) {
    this.editUser = user;
    this.tempUser = UserModel.GetNewInstance();
    this.tempUser.name = this.editUser.name;
    this.tempUser.email = this.editUser.email;
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public changeName(value) {
    this.editUser.name = value;
    if (this.editUser.name != this.tempUser.name) this.updateUser();
  }

  public changeEmail(value) {
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
    this.userProvider.updateRemoteUser(this.editUser)
    .then(
        (user: UserModel) => {
          this.messageProvider.displaySuccessMessage('message-update-user-success')
          this.setUser(user);
        }, 
        err => this.messageProvider.displayErrorMessage('message-update-user-error')
      );
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public export() {
    this.exportProvider.createCVS();
  }

  public import() {
    
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public logout() {
    this.userProvider.logout().then( promise => {
      this.app.getRootNav().setRoot(WelcomePage);
    });
  }

}
