import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../../models/category/category';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class CategoryProvider {

  public categories: CategoryModel [];
  public mappedCategoriesById: {};
  public mappedCategoriesByName: {};

  constructor(public http: HttpClient, private apiProvider: ApiProvider) {
    // console.log({ CATEGORY: this });
    this.getCategories();
  }

  public updateCategoryProvider(categories: CategoryModel []) {
    this.categories = categories;
    this.updateMappedCategories(this.categories);
  }

  private updateMappedCategories(array) {
    this.mappedCategoriesById = {}
    array.forEach(function(element) {
      this.mappedCategoriesById[element._id] = element
    }, this);
    this.mappedCategoriesByName = {}
    array.forEach(function(element) {
      this.mappedCategoriesByName[element.name] = element
    }, this);
  }

  public getCategories(): Promise<any> {
  	return new Promise((resolve, reject) => {
      this.apiProvider.getRequest('/categories', false)
        .subscribe(
          res => {
            this.updateCategoryProvider(CategoryModel.ParseFromArray(res));
            resolve(CategoryModel.ParseFromArray(res));
          },
          err => reject(<any>err));
    });
  }

}
