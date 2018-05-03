import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'

@Injectable()

export class AuthService {

  private status:any = {
    accessToken: null,
    tokenType: null,
    isLogged: false
  };

  /**
   * Set isLogged in the local storage
   * @param {boolean} logged
   * @returns {boolean}
   */
  setLogged(logged:boolean):boolean{
    this.status.isLogged = logged;
    localStorage.setItem('isLogged', logged.toString());
    return this.status.isLogged;
  };

  /**
   * Get isLogged from the local storage
   * @returns {boolean}
   */
  isLogged():boolean{
    if (!this.status.isLogged) {
      this.status.isLogged = localStorage.getItem('isLogged') == "true";
    }
    return this.status.isLogged;
  };

  /**
   * Set the token in the local storage
   * @param {string} token
   * @returns {string}
   */
  setToken(token: string): string{
    this.status.accessToken = token;
    localStorage.setItem('token', token);
    return this.status.accessToken;
  };

  /**
   * Remove the token from the local storage
   */
  clearToken() {
    localStorage.removeItem('token');
    this.status.accessToken = null;
  }

  /**
   * Get the token from the local storage
   * @returns {string}
   */
  getToken(): string{
    if (!this.status.accessToken || typeof this.status.accessToken == null) {
      this.status.accessToken = localStorage.getItem('token');
    }
    return this.status.accessToken;
  };
}
