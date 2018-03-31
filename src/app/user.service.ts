import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private isUserLoggedIn;
  private username;

  constructor() {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn() {
    this.isUserLoggedIn = true;
    localStorage.setItem('isLoggedIn', this.isUserLoggedIn);
  }

  getUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn;
  }

  setUserLogOut(){
    this.isUserLoggedIn = false;
    localStorage.clear();
  }
}
