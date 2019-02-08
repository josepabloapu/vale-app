import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../../models/category/category';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class CategoryProvider {

  public categories: CategoryModel [];
  public mappedCategoriesById: {};
  public mappedCategoriesByName: {};
  public mappedCategoriesByCode: {};

  constructor(public http: HttpClient, private apiProvider: ApiProvider) {
    // console.log({ CATEGORY: this });
    this.getCategories();
  }

  public updateCategoryProvider(categories: CategoryModel []) {
    this.categories = categories;
    this.updateMappedCategories(this.categories);
  }

  private updateMappedCategories(array) {
    this.mappedCategoriesById = {};
    this.mappedCategoriesByName = {};
    this.mappedCategoriesByCode = {};

    var self = this;
    array.forEach(function(element) {
      self.mappedCategoriesById[element._id] = element
      self.mappedCategoriesByName[element.name] = element
      self.mappedCategoriesByCode[element.code] = element
    });

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
