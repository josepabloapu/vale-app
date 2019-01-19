import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
import { MePage } from '../pages/me/me';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { ApiProvider } from '../providers/api/api';
import { TransactionProvider } from '../providers/transaction/transaction';
import { AccountProvider } from '../providers/account/account';
import { CategoryProvider } from '../providers/category/category';
import { CurrencyProvider } from '../providers/currency/currency';
import { StatsProvider } from '../providers/stats/stats';
import { AccountTypeProvider } from '../providers/account-type/account-type';
import { MeProvider } from '../providers/me/me';
import { TokenProvider } from '../providers/token/token';

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
    MePage,
    EditUserPage,
    TabsPage
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
    MePage,
    EditUserPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UserProvider,
    ApiProvider,
    TransactionProvider,
    AccountProvider,
    CategoryProvider,
    CurrencyProvider,
    StatsProvider,
    AccountTypeProvider,
    MeProvider,
    TokenProvider
  ]
})
export class AppModule {}
