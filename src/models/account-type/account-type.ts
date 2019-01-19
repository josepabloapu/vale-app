export class AccountTypeModel {
  
  public _id: string;  
  public name: string;
  public description: string;
  public code: string;

  public static GetNewInstance(): AccountTypeModel {
    return new AccountTypeModel(null, null, null, null)
  }

  public static ParseFromObject(object): AccountTypeModel {
    const model = AccountTypeModel.GetNewInstance();

    if (object) {
      model._id = object._id;
      model.name = object.name;
      model.description = object.description;
      model.code = object.code;
    }

    return model;
  }

  public static ParseFromArray(array): AccountTypeModel [] {
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
