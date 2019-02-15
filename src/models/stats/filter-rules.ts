export class FilterRulesModel {
   
  public owner: string;
  public account: string;
  public currency: string;
  public category: string;
  public type: string;
  public dateStart: string;
  public dateEnd: string;

  public static GetNewInstance(): FilterRulesModel {
    return new FilterRulesModel(null, null, null, null, null, null, null)
  }

  public static ParseFromObject(object): FilterRulesModel {
    const model = FilterRulesModel.GetNewInstance();

    if (object) {
      model.owner = object.owner;
      model.account = object.account;
      model.currency = object.currency;
      model.category = object.category;
      model.type = object.type;
      model.dateStart = object.dateStart;
      model.dateEnd = object.dateEnd;
    }

    return model;
  }

  public static ParseFromArray(array): FilterRulesModel [] {
    const modelArray = [];

    for(var i = 0; i < array.length; i ++) {
      modelArray.push(this.ParseFromObject(array[i]))
    }

    return modelArray;
  }

  constructor(owner: string, account: string, currency: string, category: string, type: string, dateStart: string, dateEnd: string) {
    this.owner = owner;
    this.account = account;
    this.currency = currency;
    this.category = category;
    this.type = type;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
  }

}
