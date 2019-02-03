import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TransactionsPage } from '../transactions/transactions';
import { AccountsPage } from '../accounts/accounts';
import { StatsPage } from '../stats/stats';
import { EditUserPage } from '../edit-user/edit-user';
import { ApiProvider } from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
import { AccountProvider } from '../../providers/account/account';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = TransactionsPage;
  tab2Root = AccountsPage;
  tab3Root = StatsPage;
  tab4Root = EditUserPage;

  constructor(
    private translateService: TranslateService,
  	private apiProvider: ApiProvider, 
    private userProvider: UserProvider, 
  	private accountProvider: AccountProvider, 
    private accountTypeProvider: AccountTypeProvider, 
  	private transactionProvider: TransactionProvider,
  	private currencyProvider: CurrencyProvider, 
  	private categoryProvider: CategoryProvider) 
  {
  	// console.log({ TABS: this })
    this.translateService.use(this.userProvider.user.language);
  }
  
}
