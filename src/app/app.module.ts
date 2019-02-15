import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { WelcomePage } from '../pages/welcome/welcome';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { TransactionsPage } from '../pages/transactions/transactions';
import { NewTransactionPage } from '../pages/new-transaction/new-transaction';
import { EditTransactionPage } from '../pages/edit-transaction/edit-transaction';
import { AccountsPage } from '../pages/accounts/accounts';
import { NewAccountPage } from '../pages/new-account/new-account';
import { EditAccountPage } from '../pages/edit-account/edit-account';
import { StatsPage } from '../pages/stats/stats';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiProvider } from '../providers/api/api';
import { TransactionProvider } from '../providers/transaction/transaction';
import { AccountProvider } from '../providers/account/account';
import { CategoryProvider } from '../providers/category/category';
import { CurrencyProvider } from '../providers/currency/currency';
import { StatsProvider } from '../providers/stats/stats';
import { AccountTypeProvider } from '../providers/account-type/account-type';

import { MessageProvider } from '../providers/message/message';
import { ExportProvider } from '../providers/export/export';
import { UserProvider } from '../providers/user/user';

import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    RegisterPage,
    LoginPage,
    TransactionsPage,
    NewTransactionPage,
    EditTransactionPage,
    AccountsPage,
    NewAccountPage,
    EditAccountPage,
    StatsPage,
    EditUserPage,
    TabsPage,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    RegisterPage,
    LoginPage,
    TransactionsPage,
    NewTransactionPage,
    EditTransactionPage,
    AccountsPage,
    NewAccountPage,
    EditAccountPage,
    StatsPage,
    EditUserPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileChooser,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    TransactionProvider,
    AccountProvider,
    CategoryProvider,
    CurrencyProvider,
    StatsProvider,
    AccountTypeProvider,
    MessageProvider,
    ExportProvider,
    UserProvider
  ]
})
export class AppModule {}
