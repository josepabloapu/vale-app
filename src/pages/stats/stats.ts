import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserModel } from '../../models/user/user';
import { CategoryModel } from '../../models/category/category';
import { FilterRulesModel } from '../../models/stats/filter-rules';
import { UserProvider } from '../../providers/user/user';
import { CategoryProvider } from '../../providers/category/category';
import { CurrencyProvider } from '../../providers/currency/currency';
import { StatsProvider } from '../../providers/stats/stats';
import { MessageProvider } from '../../providers/message/message';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {

  public user: UserModel;
  public balance: any;
	public categories: CategoryModel [];
  public incomeCategories: CategoryModel [];
  public expenseCategories: CategoryModel [];
  public dataSortedByDate: Object;
  public expenseCategoriesBalance: Object;
  public totalBalanceOfExpenseCategories: number;
  public totalBalanceOfIncomeCategories: number;
  public dateTerms: string [];
  public dateTermsToDisplay: string [];
  private loading: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public userProvider: UserProvider,
  	public statsProvider: StatsProvider,
  	public categoryProvider: CategoryProvider,
    public currencyProvider: CurrencyProvider,
    public messageProvider: MessageProvider) 
  {
    this.initializeData();
    this.messageProvider.translateService.get('loading').subscribe( value => {
      this.loading = this.messageProvider.loadingCtrl.create({ content: value })
    });
    this.loading.present().then(() => {
      this.getStats().then( res => {
        this.loading.dismiss();
      })
    })
    // console.log({PAGE_STATS: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad StatsPage');
  }

  ionViewWillEnter() {
    this.getStats()
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Initialize data from providers and construct how is going to be store the stats data */

  private initializeData() {
    this.setUser(this.userProvider.user); 
    this.setCategories(this.categoryProvider.categories);
    this.initializeDateTermsArray();
    this.initializaeCategoriesArraysPerType();
    this.initializeDataSortedByDate();
  }

  private setUser(user: UserModel) {
    this.user = user;
  }

  private setCategories(categories: CategoryModel []) {
    this.categories = categories;
  }

  private initializaeCategoriesArraysPerType() {
    this.incomeCategories = [];
    this.expenseCategories = [];

    this.categories.forEach(function(element) {
      switch(element.type) {
        case 'income':
          this.incomeCategories.push(element);
          break;
        case 'expense':
          this.expenseCategories.push(element);
          break;
        default:
          // code block
      }
    }, this);
  }

  private initializeDataSortedByDate() {
    var self = this;
    this.dataSortedByDate = {};
    this.dateTerms.forEach(function(term) {
      self.initializeDataSortedByDatePerTerm(term);
    })
  }

  private initializeDataSortedByDatePerTerm(term) {
    var self = this;
    this.dataSortedByDate[term] = { 
      categoriesBalance: {},
      validExpenseCategories: [],
      expenseBalance: null, 
      incomeBalance: null 
    };
    this.expenseCategories.forEach(function(element) {
      self.dataSortedByDate[term].categoriesBalance[element.name] = { 
        name: element.name, 
        type: element.type, 
        count: 0, 
        balance: 0, 
        percentage: 0 
      }
    });
  }

  private initializeDateTermsArray() {
    this.dateTerms = ['today', 'yesterday', 'this-week', 'last-week', 'this-month', 'last-month', 'this-year', 'last-year']
    this.dateTermsToDisplay = ['today', 'yesterday', 'this-week', 'last-week']
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Functions to compute expense balance, a its percentage per category */

  private getStats() {
    
    let promises = []
    
    var self = this;
    this.dateTerms.forEach(function(term) {
      promises.push(new Promise((resolve) => {
        self.computeExpenseCategoriesByDate(term).then( total => {
          resolve({term: term, total: total})
        })
      }))
    })

    return Promise.all(promises)

  }

  private async computeExpenseCategoriesByDate(date: string) {
    return new Promise((resolve) => {
      this.getExpenseCategoriesBalance(date).then( total => {
        this.dataSortedByDate[date].expenseBalance = total;
        this.dataSortedByDate[date].validExpenseCategories = [];
        for (let element of this.expenseCategories) {
          if (total != 0) {
            let balance = this.dataSortedByDate[date].categoriesBalance[element.name].balance;
            this.dataSortedByDate[date].categoriesBalance[element.name].percentage = 100 * balance / total;
            
            if (this.dataSortedByDate[date].categoriesBalance[element.name].percentage) {
              this.dataSortedByDate[date].validExpenseCategories.push(element);
            }
          }
        }
        resolve(total);
      });
    });
  }

  private async getExpenseCategoriesBalance(date: string) : Promise<any> {
    return new Promise((resolve) => {
      this.getCategoriesBalance(this.expenseCategories, date).then( balances => {
        let total = 0;
        for (let item of balances) {
          total = total + item.balance;
        }
        resolve(total);
      });
    });
  }

  private async getCategoriesBalance(categories: CategoryModel [], date: string) {
    
    let promises = [];

    for (let element of categories) {
      promises.push(new Promise((resolve) => {
        this.getCategoryBalance(element, date).then( balance => {
          this.dataSortedByDate[date].categoriesBalance[element.name].balance = balance;
          resolve({element: date, balance: balance})
        })
      }))
    }

    return Promise.all(promises);

  }

  private async getCategoryBalance(category: CategoryModel, date: string) : Promise<any> {
    return new Promise((resolve) => {

      let filterRules: FilterRulesModel = FilterRulesModel.GetNewInstance();
      filterRules.category = this.categoryProvider.mappedCategoriesByCode[category.code]._id
      filterRules.currency = this.userProvider.user.currency;
      let filterDate: any = this.filterDate(date)
      filterRules.dateStart = filterDate.dateStart;
      filterRules.dateEnd = filterDate.dateEnd
      this.statsProvider.getBalance(filterRules).then( balance => {
        resolve(balance.amount)
      })
      
        // this.statsProvider.getBalancePerCategoryAndDate(category, date).then( balance => {
        //   resolve(balance)
        // })

    });
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Functions to be used with angular expressions */

  public objectKeys(obj) {
    return Object.keys(obj);
  }

  public getCurrencyReadableObject(id: string) {
    return this.currencyProvider.mappedCurrenciesById[id];
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Function to filter transactions */

  public filterDate(term){
    let dateMatch: any = {};
    switch(term) { 
      case 'today': { 
        dateMatch.dateEnd = moment().endOf('day').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('day').toDate().toISOString();
        break;
      } 
      case 'yesterday': { 
        dateMatch.dateEnd = moment().endOf('day').subtract(1, 'days').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('day').subtract(1, 'days').toDate().toISOString();
        break;
      }
      case 'this-week': {
        dateMatch.dateEnd = moment().endOf('week').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('week').toDate().toISOString();
        break;
      }
      case 'last-week': {
        dateMatch.dateEnd = moment().endOf('week').subtract(1, 'weeks').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('week').subtract(1, 'weeks').toDate().toISOString();
        break;
      }
      case 'this-month': {
        dateMatch.dateEnd = moment().endOf('month').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('month').toDate().toISOString();
        break;
      }
      case 'last-month': {
        dateMatch.dateEnd = moment().endOf('month').subtract(1, 'months').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('month').subtract(1, 'months').toDate().toISOString();
        break;
      }
      case 'this-year': {
        dateMatch.dateEnd = moment().endOf('year').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('year').toDate().toISOString();
        break;
      }
      case 'last-year': {
        dateMatch.dateEnd = moment().endOf('year').subtract(1, 'years').toDate().toISOString();
        dateMatch.dateStart = moment().startOf('year').subtract(1, 'years').toDate().toISOString();
        break;
      }
      default: { 
         //statements; 
         break; 
      }
    }
    return dateMatch;
  }

}
