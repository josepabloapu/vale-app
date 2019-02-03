import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserModel } from '../../models/user/user';
import { CategoryModel } from '../../models/category/category';
import { UserProvider } from '../../providers/user/user';
import { CategoryProvider } from '../../providers/category/category';
import { CurrencyProvider } from '../../providers/currency/currency';
import { StatsProvider } from '../../providers/stats/stats';

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

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public userProvider: UserProvider,
  	public statsProvider: StatsProvider,
  	public categoryProvider: CategoryProvider,
    public currencyProvider: CurrencyProvider) 
  {
    this.initializeData();
    // console.log({PAGE_STATS: this})
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad StatsPage');
  }

  ionViewWillEnter() {
    var self = this;

    self.getStats();
    setTimeout(function() {
      self.getStats();
    }, 2000); 
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
    this.dateTerms = []
    this.dateTerms = ['today', 'yesterday', 'this-week', 'last-week', 'this-month', 'last-month', 'this-year', 'last-year']
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  /* Functions to compute expense balance, a its percentage per category */

  private getStats() {
    var self = this;
    this.dateTerms.forEach(function(term) {
      self.computeExpenseCategoriesByDate(term);
    })
  }

  private async computeExpenseCategoriesByDate(date: string) {
    return new Promise((resolve) => {
      var self = this;
      this.computeExpenseTotalBalance(date).then( total => {
        self.dataSortedByDate[date].expenseBalance = total;
        for (let element of self.expenseCategories) {
          if (total != 0) {
            let balance = self.dataSortedByDate[date].categoriesBalance[element.name].balance;
            self.dataSortedByDate[date].categoriesBalance[element.name].percentage = 100 * balance / total;
          }
        }
        resolve();
      });
    });
  }

  private async computeExpenseTotalBalance(date: string) : Promise<any> {
    return new Promise((resolve) => {
      var total = 0;
      this.getExpenseCategoriesBalance(date).then( object => {
        for (let element of this.expenseCategories) {
          total = total + this.dataSortedByDate[date].categoriesBalance[element.name].balance 
        }
        resolve(total);
      });
    });
  }

  private async getExpenseCategoriesBalance(date: string) {
    return new Promise((resolve) => {
      this.getCategoriesBalance(this.expenseCategories, date).then( object => {
        resolve(object);
      });
    });
  }

  private async getCategoriesBalance(categories: CategoryModel [], date: string) {
    return new Promise((resolve) => {
      let array = []
      for (let element of categories) {
        this.getCategoryBalance(element, date).then( balance => {
          this.dataSortedByDate[date].categoriesBalance[element.name].balance = balance;
          array.push(balance);
        })
      }
      resolve(array);
    });
  }

  private async getCategoryBalance(category: CategoryModel, date: string) {
    return new Promise((resolve) => {
        this.statsProvider.getBalancePerCategoryAndDate(category, date).then( balance => {
          resolve(balance)
        })
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

}
