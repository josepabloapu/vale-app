export class CategoryModel {
	
	public _id: string;  
	public name: string;
	public description: string;
	public code: string;
  public type: string;
	public percentage: number;
	public showInDashboard: boolean;

  public static GetNewInstance(): CategoryModel {
    return new CategoryModel(null, null, null, null, null, null, null)
  }

  public static ParseFromObject(object): CategoryModel {
    const model = CategoryModel.GetNewInstance();

    if (object) {
      model._id = object._id;
      model.name = object.name;
      model.description = object.description;
      model.code = object.code;
      model.type = object.type;
      model.percentage = object.percentage;
      model.showInDashboard = object.showInDashboard;
    }

    return model;
  }

  public static ParseFromArray(array): CategoryModel [] {
    const modelArray = [];

    for(var i = 0; i < array.length; i ++) {
      modelArray.push(this.ParseFromObject(array[i]))
    }

    return modelArray;
  }

  constructor(id: string, name: string, description: string, code: string, type: string, percentage: number, showInDashboard: boolean) {
    this._id = id;
    this.name = name;
    this.description = description;
    this.code = code;
    this.type = type;
    this.percentage = percentage;
    this.showInDashboard = showInDashboard;
  }

}
