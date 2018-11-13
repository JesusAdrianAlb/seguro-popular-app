import { Injectable } from '@angular/core';
import { User } from '../models/user.models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  userChange = new Subject<User>();
  constructor() { }

  setLogginData(data: User) {
    this.user = data;
    if (data) {
      this.userChange.next(this.user);
    } else {
      this.userChange.next(null);
    }

  }

  getLogginData() {
    return this.user;
  }
}
