import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TransactionsPage } from '../transactions/transactions';
import { AccountsPage } from '../accounts/accounts';
import { StatsPage } from '../stats/stats';
import { MePage } from '../me/me';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { MeProvider } from '../../providers/me/me';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { StatsProvider } from '../../providers/stats/stats';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { TokenProvider } from '../../providers/token/token';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = TransactionsPage;
  tab2Root = AccountsPage;
  tab3Root = StatsPage;
  tab4Root = MePage;

  constructor(
    private translateService: TranslateService,
  	private apiProvider: ApiProvider, 
  	private authProvider: AuthProvider, 
  	private userProvider: UserProvider, 
    private meProvider: MeProvider, 
  	private accountProvider: AccountProvider, 
    private accountTypeProvider: AccountTypeProvider, 
  	private transactionProvider: TransactionProvider,
    private tokenProvider: TokenProvider,
  	private currencyProvider: CurrencyProvider, 
  	private categoryProvider: CategoryProvider) 
  {
  	console.log({ TABS: this })
    this.translateService.use(this.userProvider.user.language);
  }
  
}
