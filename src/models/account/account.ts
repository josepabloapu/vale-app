export class AccountModel {
	
	public _id: string;  
	public name: string;
	public description: string;
	public type: string;
  public currency: string;
	public balance: string;
	public initialBalance: number;
	public cumulativeInflow: number;
	public cumulativeOutflow: number;
  public owner: string;

  public static GetNewInstance(): AccountModel {
    return new AccountModel(null, null, null, null, null, null, null, null, null, null)
  }

  public static ParseFromObject(object): AccountModel {
    const model = AccountModel.GetNewInstance();

    if (object) {
      model._id = object._id;
      model.name = object.name;
      model.description = object.description;
      model.type = object.type;
      model.currency = object.currency;
      model.balance = object.balance;
      model.initialBalance = object.initialBalance;
      model.cumulativeInflow = object.cumulativeInflow;
      model.cumulativeOutflow = object.cumulativeOutflow;
      model.owner = object.owner;
    }

    return model;
  }

  public static ParseFromArray(array): AccountModel [] {
    const modelArray = [];

    for(var i = 0; i < array.length; i ++) {
      modelArray.push(this.ParseFromObject(array[i]))
    }

    return modelArray;
  }

  constructor(id: string, name: string, description: string, type: string, currency: string, balance: string, initialBalance: number, cumulativeInflow: number, cumulativeOutflow: number, owner: string) {
    this._id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.currency = currency;
    this.balance = balance;
    this.initialBalance = initialBalance;
    this.cumulativeInflow = cumulativeInflow;
    this.cumulativeOutflow = cumulativeOutflow;
    this.owner = owner;
  }

}
