import { Injectable } from '@angular/core';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  constructor() { }

  setLogginData(data: User) {
    this.user = data;
  }

  getLogginData() {
    return this.user;
  }
}
