import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'

@Injectable()

export class AuthService {

  private status:any = {
    accessToken: null,
    tokenType: null,
    isLogged: false
  };

  setLogged(logged:boolean):boolean{
    this.status.isLogged = logged;
    localStorage.setItem('isLogged', logged.toString());
    return this.status.isLogged;
  };

  isLogged():boolean{
    if (!this.status.isLogged) {
      this.status.isLogged = localStorage.getItem('isLogged') == "true";
    }
    return this.status.isLogged;
  };

  setToken(token: string): string{
    this.status.accessToken = token;
    localStorage.setItem('token', token);
    return this.status.accessToken;
  };

  clearToken() {
    localStorage.removeItem('token');
    this.status.accessToken = null;
  }

  getToken(): string{
    if (!this.status.accessToken || typeof this.status.accessToken == null) {
      this.status.accessToken = localStorage.getItem('token');
    }
    return this.status.accessToken;
  };
}
