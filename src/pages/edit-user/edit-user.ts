import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, App } from 'ionic-angular'
import { TranslateService } from '@ngx-translate/core'
import { UserModel } from '../../models/user/user'
import { CurrencyModel } from '../../models/currency/currency'
import { MessageProvider } from '../../providers/message/message'
import { UserProvider } from '../../providers/user/user'
import { AccountProvider } from '../../providers/account/account'
import { TransactionProvider } from '../../providers/transaction/transaction'
import { CurrencyProvider } from '../../providers/currency/currency'
import { ExportProvider } from '../../providers/export/export'
import { WelcomePage } from '../../pages/welcome/welcome'

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

	public editUser: UserModel
  public tempUser: UserModel
  public currencies: CurrencyModel []
  public dangerZoneIsDisabled: boolean
  public loadProgress: number
  private loading: any

  constructor(
    public app: App,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private translateService: TranslateService,
    private messageProvider: MessageProvider,
    public userProvider: UserProvider,
    public accountProvider: AccountProvider,
    public transactionProvider: TransactionProvider,
    public currencyProvider: CurrencyProvider,
    public exportProvider: ExportProvider) 
  {

    this.dangerZoneIsDisabled = true
  	this.setCurrencies(this.currencyProvider.currencies)
  	this.setUser(this.userProvider.user)
    // console.log({PAGE_EDITUSER: this})

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditUserPage')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private setCurrencies(currencies: CurrencyModel []) {
    this.currencies = currencies
  }

  private setUser(user: UserModel) {
    this.editUser = user
    this.tempUser = UserModel.GetNewInstance()
    this.tempUser.name = this.editUser.name
    this.tempUser.email = this.editUser.email
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public changeName(value) {
    this.editUser.name = value
    if (this.editUser.name != this.tempUser.name) this.updateUser()
  }

  public changeEmail(value) {
    this.editUser.email = value
    if (this.editUser.email != this.tempUser.email) this.updateUser()
  }

  public changeLanguage(value) {
    this.editUser.language = value
    this.translateService.use(value)
    this.updateUser()
  }

  public changeCurrency(value) {
    this.editUser.currency = value
    this.updateUser()
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private updateUser() {
    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
      this.loading.present().then(() => {
        this.userProvider.updateRemoteUser(this.editUser)
        .then(
          (user: UserModel) => {
            this.loading.dismiss()
            this.messageProvider.displaySuccessMessage('message-update-user-success')
            this.setUser(user)
          }, 
          err => {
            this.loading.dismiss()
            this.messageProvider.displayErrorMessage('message-update-user-error')
          }
        )
      })
    })
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public export() {
    // this.exportProvider.computeCSV().then( csv => {
    //   console.log(csv)
    // })
    this.exportProvider.createCVS()
  }

  public import() {
    // this.exportProvider.readLocalFile()
    this.exportProvider.chooseCsvFile()
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public logout() {
    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
      this.loading.present().then(() => {
        this.userProvider.logout().then( promise => {
          this.loading.dismiss();
          this.app.getRootNav().setRoot(WelcomePage)
        })
      })
    })
  }

  public activateDangerZoneAlertMessage() {
    this.messageProvider.displayAlertConfirmMessage('are-you-sure?').then( res => {
      if (this.messageProvider.flag == true) {
        this.activateDangerZone()
        this.messageProvider.flag = false
      }
    })
  }

  private activateDangerZone() {
    this.dangerZoneIsDisabled = !this.dangerZoneIsDisabled
  }

  public deactivateDangerZone() {
    this.dangerZoneIsDisabled = true
  }

  public removeAllTransactionsAlertMessage() {
    this.messageProvider.displayAlertConfirmMessage('are-you-sure?').then( res => {
      if (this.messageProvider.flag == true) {
        this.removeAllTransactions()
        this.messageProvider.flag = false
      }
    })
  }

  private removeAllTransactions() {
    this.exportProvider.removeAllTransactionsWithLoading()
  }

  public removeAllAccountsAlertMessage() {
    this.messageProvider.displayAlertConfirmMessage('are-you-sure?').then( res => {
      if (this.messageProvider.flag == true) {
        this.removeAllAccounts()
        this.messageProvider.flag = false
      }
    })
  }

  private removeAllAccounts() {
    this.exportProvider.removeAllAccountsWithLoading()
  }

  public removeUserAlertMessage() {
    this.messageProvider.displayAlertConfirmMessage('are-you-sure?').then( res => {
      if (this.messageProvider.flag == true) {
        this.removeUser()
        this.messageProvider.flag = false
      }
    })
  }

  private async removeUser(): Promise<any> {
    await this.transactionProvider.removeAllTransactions()
    await this.accountProvider.removeAllAccounts()
    await this.userProvider.deleteRemoteUser()
    await this.userProvider.removeLocalUser()
    this.app.getRootNav().setRoot(WelcomePage)
  }

}
