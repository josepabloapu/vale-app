export class UserModel {
  
  public _id: string;
  public username: string;
  public token: string;
  public name: string;
  public email: string;
  public role: string;
  public language: string;
  public currency: string;
  
  public static GetNewInstance(): UserModel {
    return new UserModel(null, null, null, null, null, null, null, null)
  }

  public static ParseFromObject(object): UserModel {
    const model = UserModel.GetNewInstance();

    if (object) {
      model._id = object._id;
      model.username = object.username;
      model.token = object.token;
      model.name = object.name;
      model.email = object.email;
      model.role = object.role;
      model.language = object.language;
      model.currency = object.currency;
    }

    return model;
  }

  constructor(id: string, username: string, token: string, name: string, email: string, role: string, language: string, currency: string) {
    this._id = id;
    this.username = username;
    this.token = token;
    this.name = name;
    this.email = email;
    this.role = role;
    this.language = language;
    this.currency = currency;
  }

}