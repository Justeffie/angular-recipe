export class User {
  constructor(public email: string, public id: string, private _token: string, private _tokenExpirationDate: number) {}

  get token() {
    if(!this._tokenExpirationDate || new Date().getDate() > this._tokenExpirationDate) {}
    return this._token;
  }
}