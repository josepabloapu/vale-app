import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  constructor(public http: HttpClient, private translateService: TranslateService, private toastCtrl: ToastController) {

  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public presentSuccessToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'middle',
      cssClass: 'successToast'
    });
    toast.onDidDismiss(() => {
      // code here
    });
    toast.present();
  }

  public presentErrorToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle',
      cssClass: 'errorToast'
    });
    toast.onDidDismiss(() => {
      // code here
    });
    toast.present();
  }

  public displaySuccessMessage(message) {
    this.translateService.get(message).subscribe(
      value => {
        this.presentSuccessToast(value)
      }
    )
  }

  public displayErrorMessage(message) {
    this.translateService.get(message).subscribe(
      value => {
        this.presentErrorToast(value)
      }
    )
  }

}
