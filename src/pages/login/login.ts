import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { LoginService } from '../../services/login.service';
import { LoginInfos } from '../../entities/loginInfos';
import { TabsPage } from '../tabs/tabs';
import { RegistrationPage } from '../registration/registration';
import {GeolocationService} from '../../services/geolocation.service';
import {Gpscoordinates} from '../../entities/gpscoordinates';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  activityCoord: Gpscoordinates [];

  loginInfos : LoginInfos = {
    username: "",
    password: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginService: LoginService,
              public alertCtrl: AlertController, private geolocationService: GeolocationService) {
  }

  ionViewDidLoad() {
    this.geolocationService.startRecording(100);
  }

  login() {
    this.activityCoord = this.geolocationService.getListCoord();
    this.loginService.login(this.loginInfos)
      .subscribe(() => {
          this.navCtrl.setRoot(TabsPage);
        },
        (err) => {
          console.error(err);
          let message;
          if(err.status == 0) {
            message = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
          }else{
            message = err.error;
          }
          let alert = this.alertCtrl.create({
            title: 'La connexion a échoué',
            subTitle: message,
            buttons: ['OK']
          });
          alert.present();
        });
  }

  createAccount(){
    this.navCtrl.push(RegistrationPage);
    this.geolocationService.stopRecording();

  }

}
