import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import { LoginService } from '../../services/login.service';
import { LoginInfos } from '../../entities/loginInfos';
import { TabsPage } from '../tabs/tabs';
import { RegistrationPage } from '../registration/registration';
import {CronService} from '../../services/cron.service';
import {ProgrammeService} from '../../services/programme.service';

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
              public alertCtrl: AlertController, private cronService: CronService,
              private programmeService: ProgrammeService, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Mise à jour des données...'
    });
    loading.present();
    this.loginService.login(this.loginInfos).subscribe(() => {
          this.cronService.update().subscribe(()=> {
            loading.dismiss();
            this.navCtrl.setRoot(TabsPage);
           /* this.programmeService.generateProgramme().subscribe(() => {
              loading.dismiss();
              this.navCtrl.setRoot(TabsPage);
            });*/
          });
        },
        (err) => {
          loading.dismiss();
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
  }
}
