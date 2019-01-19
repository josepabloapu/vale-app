import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTransactionPage } from './new-transaction';

@NgModule({
  declarations: [
    NewTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(NewTransactionPage),
  ],
})
export class NewTransactionPageModule {}
