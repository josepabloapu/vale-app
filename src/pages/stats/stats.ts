import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CategoryModel } from '../../models/category/category';

import { StatsProvider } from '../../providers/stats/stats';
import { CategoryProvider } from '../../providers/category/category';

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'values',  pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
}

/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
	public balance: any;
  public totalBalanceOfExpenseCategories: number;
  public totalBalanceOfIncomeCategories: number;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private statsProvider: StatsProvider,
  	private categoryProvider: CategoryProvider) 
  {
  	this.loadCategories();
    this.initStats();
  	this.balance = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }

  ionViewWillEnter() {
    this.getStats();
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

  private initStats() {
    this.expenseCategoriesBalance = {};
    this.expenseCategories.forEach(function(element) {
      this.expenseCategoriesBalance[element.name] = { name: element.name, count: 0, balance: 0, percentage: 0 }
    }, this);
  }

  private objectKeys(obj) {
    return Object.keys(obj);
  }

  private getStats() {
    this.getTotalBalancePerType()
    this.expenseCategories.forEach(function(element) {
      this.statsProvider.getCategoryBalance(element).then(
        res => {
          let percentage = res.amount / this.totalBalanceOfExpenseCategories * 100;
          this.expenseCategoriesBalance[element.name] = { name: element.name, count: res.count, balance: res.amount, percentage: percentage }
        }
      );
    }, this);
  }

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
