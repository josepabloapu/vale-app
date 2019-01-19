export class TransactionModel {
  
  public _id: string;  
  public amount: number;
  public description: string;
  public type: string;
  public currency: string;
  public category: string;
  public account: string;
  public owner: string;
  public date: string;

  public static GetNewInstance(): TransactionModel {
    return new TransactionModel(null, null, null, null, null, null, null, null, null)
  }

  public static ParseFromObject(object): TransactionModel {
    const model = TransactionModel.GetNewInstance();

    if (object) {
      model._id = object._id;
      model.amount = object.amount;
      model.description = object.description;
      model.type = object.type;
      model.currency = object.currency;
      model.category = object.category;
      model.account = object.account;
      model.owner = object.owner;
      model.date = object.date;
    }

    return model;
  }

  public static ParseFromArray(array): TransactionModel [] {
    const modelArray = [];

    for(var i = 0; i < array.length; i ++) {
      modelArray.push(this.ParseFromObject(array[i]))
    }

    return modelArray;
  }

  constructor(id: string, amount: number, description: string, type: string, currency: string, category: string, account: string, owner: string, date: string) {
    this._id = id;
    this.amount = amount;
    this.description = description;
    this.type = type;
    this.currency = currency;
    this.category = category;
    this.account = account;
    this.owner = owner;
    this.date = date;
  }

}
