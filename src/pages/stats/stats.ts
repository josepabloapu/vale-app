import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CategoryModel } from '../../models/category/category';

import { StatsProvider } from '../../providers/stats/stats';
import { CategoryProvider } from '../../providers/category/category';

import {Pipe, PipeTransform} from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {

	public categories: CategoryModel [];
  public incomeCategories: CategoryModel [];
  public expenseCategories: CategoryModel [];
  public expenseCategoriesBalance: Object;
  public dataSortedByDate: Object;
	public balance: any;
  public totalBalanceOfExpenseCategories: number;
  public totalBalanceOfIncomeCategories: number;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private statsProvider: StatsProvider,
  	private categoryProvider: CategoryProvider) 
  {
    this.dataSortedByDate = {};
  	this.loadCategories();
    this.initStats();
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
    }, 1000);
    
  }

  /* CATEGORIES */
  /************/

  public updateCategories(categories: CategoryModel []) {
    this.categories = categories;
    this.computeCategoriesPerType();
  }

  private loadCategories() {
    this.updateCategories(this.categoryProvider.categories);
  }

  // private functionOne() {
  //   for (category in person) {
  //     text += person[x];
  //   }
  // }

  private initStats() {

    var self = this;

    this.dataSortedByDate['this-month'] = { 
      categoriesBalance: {}, 
      expenseBalance: null, 
      incomeBalance: null 
    };

    this.dataSortedByDate['this-year'] = { 
      categoriesBalance: {}, 
      expenseBalance: null, 
      incomeBalance: null 
    };

    this.expenseCategories.forEach(function(element) {
      self.dataSortedByDate['this-month'].categoriesBalance[element.name] = { 
        name: element.name, 
        type: element.type, 
        count: 0, 
        balance: 0, 
        percentage: 0 
      }
      self.dataSortedByDate['this-year'].categoriesBalance[element.name] = { 
        name: element.name, 
        type: element.type, 
        count: 0, 
        balance: 0, 
        percentage: 0 
      }
    });
    
    this.expenseCategoriesBalance = {};
    this.expenseCategories.forEach(function(element) {
      this.expenseCategoriesBalance[element.name] = { name: element.name, count: 0, balance: 0, percentage: 0 }
    }, this);
  
  }

  private objectKeys(obj) {
    return Object.keys(obj);
  }

  private getStats() {
    this.computeExpenseCategoriesByDate('this-month')
    this.computeExpenseCategoriesByDate('this-year')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */
  // 

  private async getCategoryBalance(category: CategoryModel, date: string) {
    return new Promise((resolve, reject) => {
        this.statsProvider.getBalancePerCategoryAndDate(category, date).then( balance => {
          // console.log({LEVEL4: balance})
          resolve(balance)
        })
    });
  }

  private async getCategoriesBalance(categories: CategoryModel [], date: string) {
    return new Promise((resolve, reject) => {
      let array = []
      var self = this;
      for (let element of categories) {
        this.getCategoryBalance(element, date).then( balance => {
          self.dataSortedByDate[date].categoriesBalance[element.name].balance = balance;
          array.push(balance);
        })
      }
      // console.log({LEVEL3: array})
      resolve(array);
    });
  }

  private async getExpenseCategoriesBalance(date: string) {
    var self = this;
    return new Promise((resolve, reject) => {
      this.getCategoriesBalance(this.expenseCategories, date).then( object => {
        // console.log({LEVEL2: object})
        resolve(object);
      });
    });
  }

  private async computeExpenseTotalBalance(date: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      var self = this;
      var total = 0;
      this.getExpenseCategoriesBalance(date).then( object => {
        for (let element of self.expenseCategories) {
          total = total + self.dataSortedByDate[date].categoriesBalance[element.name].balance 
        }
        // console.log({LEVEL1: total})
        resolve(total);
      });
    });
  }

  private async getExpenseTotalBalance(date: string) {
    return new Promise((resolve, reject) => {
      var self = this;
      this.computeExpenseTotalBalance(date).then( total => {
        self.dataSortedByDate[date].expenseBalance = total;
        // console.log({LEVEL0: total})
        resolve();
      });
    });
  }

  private async computeExpenseCategoriesByDate(date: string) {
    return new Promise((resolve, reject) => {
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

  /* ---------------------------------------------------------------------------------------------------------------- */
  // 

  // private async computeCategoriesPercentage() {
  //     return new Promise((resolve, reject) => {
  //       this.objectKeys(this.thisMonth.categoriesBalance).forEach(function(categoryName) {
  //         if (this.thisMonth.categoriesBalance[categoryName].type == 'income') let totalBalance = this.thisMonth.incomeBalance;
  //         if (this.thisMonth.categoriesBalance[categoryName].type == 'expense') let totalBalance = this.thisMonth.expenseBalance;
  //         let balance = this.thisMonth.categoriesBalance[categoryName].balance;
  //         if (totalBalance == 0) this.thisMonth.categoriesBalance[categoryName].percentage = 0
  //         if (totalBalance != 0) this.thisMonth.categoriesBalance[categoryName].percentage = balance / totalBalance * 100;  
  //       }, this);
  //       this.objectKeys(this.thisYear.categoriesBalance).forEach(function(categoryName) {
  //         if (this.thisYear.categoriesBalance[categoryName].type == 'income') let totalBalance = this.thisYear.incomeBalance;
  //         if (this.thisYear.categoriesBalance[categoryName].type == 'expense') let totalBalance = this.thisYear.expenseBalance;
  //         let balance = this.thisYear.categoriesBalance[categoryName].balance;
  //         if (totalBalance == 0) this.thisYear.categoriesBalance[categoryName].percentage = 0
  //         if (totalBalance != 0) this.thisYear.categoriesBalance[categoryName].percentage = balance / totalBalance * 100;  
  //       }, this);
  //     resolve();
  //   });
  // }

  private async getTotalBalancePerType() {
    return new Promise((resolve, reject) => {

      this.totalBalanceOfExpenseCategories = 0;
      this.totalBalanceOfIncomeCategories = 0;

      this.expenseCategories.forEach(function(element) {
        this.statsProvider.getCategoryBalance(element).then(
          res => { this.totalBalanceOfExpenseCategories = this.totalBalanceOfExpenseCategories + res.amount; }
        );
      }, this);

      this.incomeCategories.forEach(function(element) {
        this.statsProvider.getCategoryBalance(element).then(
          res => { this.totalBalanceOfIncomeCategories = this.totalBalanceOfIncomeCategories + res.amount; }
        );
      }, this);

      resolve();
      
    });
  }

  private computeCategoriesPerType() {
    
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

}
