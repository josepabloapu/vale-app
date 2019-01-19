export class CurrencyModel {
  
  public _id: string;  
  public name: string;
  public description: string;
  public code: string;

  public static GetNewInstance(): CurrencyModel {
    return new CurrencyModel(null, null, null, null)
  }

  public static ParseFromObject(object): CurrencyModel {
    const model = CurrencyModel.GetNewInstance();

    if (object) {
      model._id = object._id;
      model.name = object.name;
      model.description = object.description;
      model.code = object.code;
    }

    return model;
  }

  public static ParseFromArray(array): CurrencyModel [] {
    const modelArray = [];

    for(var i = 0; i < array.length; i ++) {
      modelArray.push(this.ParseFromObject(array[i]))
    }

    return modelArray;
  }

  constructor(id: string, name: string, description: string, code: string) {
    this._id = id;
    this.name = name;
    this.description = description;
    this.code = code;
  }

}
