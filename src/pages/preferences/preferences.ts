import { Component } from '@angular/core';
import { AlertController, App, NavController  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user';

@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html'
})
export class PreferencesPage {

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    objectif: null
  };

  logged = false;

  constructor(public navCtrl: NavController, private loginService: LoginService, private userService: UserService,
              private authService: AuthService, public appCtrl: App, public alertCtrl : AlertController) { }

  ionViewDidLoad () {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => { this.user = user; },
        (err) => {
          console.error(err);
          let message;
          if(err.status == 0) {
            message = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
          }else{
            message = err.error;
          }
          let alert = this.alertCtrl.create({
            title: 'Erreur',
            subTitle: message,
            buttons: ['OK']
          });
          alert.present();
        });
  }

  updateObjectif(){
    this.userService.updateObjectif(this.user.objectif).subscribe(
      () => {  },
      (err) => {
        let message;
        if(err.status == 0) {
          message = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
        }else{
          message = err.error;
        }
        let alert = this.alertCtrl.create({
          title: 'Erreur lors de la mise à jour.',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      });
  }

  logout() {
    this.loginService.logout();
    this.logged = this.authService.isLogged();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }
}
