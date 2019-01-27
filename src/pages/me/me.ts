import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
// import Models
import { UserModel } from '../../models/user/user';
// import Providers
import { AuthProvider } from '../../providers/auth/auth';
import { MeProvider } from '../../providers/me/me';
import { CurrencyProvider } from '../../providers/currency/currency';
// import Pages
import { WelcomePage } from '../../pages/welcome/welcome';
import { EditUserPage } from '../../pages/edit-user/edit-user';

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
    public translateService: TranslateService,
    public meProvider: MeProvider,
    public currencyProvider: CurrencyProvider, 
    public authProvider: AuthProvider) 
  {
    this.getAuthUser();
    // console.log({PAGE_ME: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MePage');
  }

  editUser() {
    this.navCtrl.push(EditUserPage, { }, { animate: false });
  }

  logout() {
  	this.authProvider.logout().then( promise => {
      this.app.getRootNav().setRoot(WelcomePage);
    });
  }

  getAuthUser() {
    this.user = this.meProvider.user
  }

  getCurrencyReadableName(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  changeLanguage() {
    this.translateService.use(this.meProvider.user.language);
  }

  changeCurrency() {
    
  }


}
