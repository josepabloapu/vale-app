import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TransactionsPage } from '../transactions/transactions';
import { AccountsPage } from '../accounts/accounts';
import { StatsPage } from '../stats/stats';
import { EditUserPage } from '../edit-user/edit-user';
import { UserProvider } from '../../providers/user/user';
import { AccountTypeProvider } from '../../providers/account-type/account-type';
import { CurrencyProvider } from '../../providers/currency/currency';
import { CategoryProvider } from '../../providers/category/category';
import { AccountProvider } from '../../providers/account/account';
import { TransactionProvider } from '../../providers/transaction/transaction';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = TransactionsPage;
  tab2Root = AccountsPage;
  tab3Root = StatsPage;
  tab4Root = EditUserPage;

  constructor(
  	private currencyProvider: CurrencyProvider, 
    private categoryProvider: CategoryProvider,
    private accountTypeProvider: AccountTypeProvider, 
    private accountProvider: AccountProvider, 
  	private transactionProvider: TransactionProvider,
    private translateService: TranslateService,
    private userProvider: UserProvider) 
  {
  	// console.log({ TABS: this })
    this.translateService.use(this.userProvider.user.language);
  }

}
