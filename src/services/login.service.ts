import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {LoginInfos} from "../entities/loginInfos";
import {API_SERVER} from "../app/app.constants";
import "rxjs/add/operator/do";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LoginService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  login (loginInfos: LoginInfos) {
    const url = API_SERVER.auth;
    return this.http.post<any>(url, loginInfos, httpOptions)
      .map(res => {
        if(res.token) {
          this.authService.setToken(res.token);
          this.authService.setLogged(true);
        }
        // Return res for the moment
        return res;
      });
  }

  logout() {
    this.authService.clearToken();
    this.authService.setLogged(false);
  }
}
