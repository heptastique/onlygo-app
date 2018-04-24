import { Component } from '@angular/core';
import {AlertController, App } from 'ionic-angular';
import {LoginService} from "../../services/login.service";
import {User} from "../../entities/user";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: ""
  };

  logged = false;

  constructor(public alertCtrl: AlertController, private loginService: LoginService, private userService: UserService,
              private authService: AuthService, public appCtrl: App ) { }

  ionViewDidLoad () {
    this.logged = this.authService.isLogged();
    this.getUser();
  }

  logout() {
    this.loginService.logout();
    this.logged = this.authService.isLogged();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => { this.user = user; },
        (err) => {
          console.error(err);
          let alert = this.alertCtrl.create({
            title: 'La requête a échoué.',
            subTitle: 'Vous devez être authentifié.',
            buttons: ['OK']
          });
          alert.present();
        });
  }
}

