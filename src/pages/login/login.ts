import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {LoginService} from '../../services/login.service';
import {LoginInfos} from '../../entities/loginInfos';
import {TabsPage} from '../tabs/tabs';
import {RegistrationPage} from '../registration/registration';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginInfos : LoginInfos = {
    username: "",
    password: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginService: LoginService,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {

  }

  login() {
    this.loginService.login(this.loginInfos)
      .subscribe(() => {
          this.navCtrl.setRoot(TabsPage);
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

  createAccount(){
    this.navCtrl.push(RegistrationPage)
  }

}
