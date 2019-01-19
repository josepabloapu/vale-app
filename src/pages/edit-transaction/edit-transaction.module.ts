import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTransactionPage } from './edit-transaction';

@NgModule({
  declarations: [
    EditTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(EditTransactionPage),
  ],
})
export class EditTransactionPageModule {}
