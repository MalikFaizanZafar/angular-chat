import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user;
  constructor() {}

  setUser(user){
    this.user = user;
  }

  getUser(){
    return this.user;
  }
}