import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from 'ionic-angular';

import { EditAccountPage } from '../../pages/edit-account/edit-account';
import { AccountProvider } from '../../providers/account/account';

@Injectable()
export class MessageProvider {

  public flag: boolean;

  constructor(
    public http: HttpClient, 
    public translateService: TranslateService, 
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public accountProvider: AccountProvider) 
  {
    this.flag = false;
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

  /* ---------------------------------------------------------------------------------------------------------------- */

  public displayAlertConfirmMessage(message) {
    return new Promise((resolve) => {
      let object: any = {}
      this.translateThreeStrings(message, 'no', 'yes').then(
        result => {
          object = result;
          this.presentAlertConfirm(object.string1, object.string2, object.string3).then( res => {
            resolve(res)
          })
        }
      )
    })
  }

  public presentAlertConfirm(message, no, yes) {
    return new Promise((resolve) => {
      const alert = this.alertController.create({
        message: message,
        buttons: [
          {
            text: no,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cb) => {
              this.flag = false
              resolve()
            }
          }, {
            text: yes,
            handler: (cb) => {
              this.flag = true
              resolve()
            }
          }
        ]
      });
      alert.present();
    })
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  public translateString(string) {
    return new Promise((resolve) => {
      this.translateService.get(string).subscribe(
        value => resolve(value)
      )
    });
  }

  public async translateTwoStrings(string1, string2) {
    return new Promise((resolve) => {
      var object = {string1: null, string2: null};
      this.translateString(string1).then( value1 => {
        object.string1 = value1;
        this.translateString(string2).then( value2 => {
          object.string2 = value2;
          resolve(object)
        })
      })
    });
  }

  public async translateThreeStrings(string1, string2, string3) {
    return new Promise((resolve) => {
      var object = {string1: null, string2: null, string3: null};
      this.translateString(string1).then( value1 => {
        object.string1 = value1;
        this.translateString(string2).then( value2 => {
          object.string2 = value2;
          this.translateString(string3).then( value3 => {
            object.string3 = value3;
            resolve(object)
          })
        })
      })
    });
  }

}
