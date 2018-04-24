import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {LoginInfos} from "../../entities/loginInfos";
import {LoginService} from "../../services/login.service";
import {User} from "../../entities/user";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {RegistrationPage} from '../registration/registration';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  loginInfos : LoginInfos = {
    username: "",
    password: ""
  };

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: ""
  };

  logged = false;

  constructor(public alertCtrl: AlertController, private loginService: LoginService, private userService: UserService,
              private authService: AuthService, public navCtlr: NavController)
  { }

  ionViewDidLoad () {
    this.logged = this.authService.isLogged();
  }

  login() {
    this.loginService.login(this.loginInfos)
      .subscribe(() => {
          this.getUser();
          this.logged = this.authService.isLogged();
        },
        (err) => {
          console.error(err);
          let alert = this.alertCtrl.create({
            title: 'La connection a échoué',
            subTitle: 'Mauvais mot de passe',
            buttons: ['OK']
          });
          alert.present();
        });
  }

  logout() {
    this.loginService.logout();
    this.logged = this.authService.isLogged();
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

  createAccount(){
    this.navCtlr.push(RegistrationPage)
  }
}

