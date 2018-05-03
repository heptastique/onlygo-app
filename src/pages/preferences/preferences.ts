import { Component } from '@angular/core';
import {AlertController, App, ModalController, NavController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user';
import {ProgrammeService} from '../../services/programme.service';
import {LocationModalPage} from '../location-modal/location-modal';

import {IdentifiantsModalPage} from "../identifiants-modal/identifiants-modal";
import { ObjectifsPreferencesPage } from '../objectifs-preferences/objectifs-preferences';

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
    objectifs: [],
    objectifHebdoCourse: null,
    objectifHebdoMarche: null,
    objectifHebdoCyclisme: null,
    distanceMax: null,
    location: null
  };

  logged = false;

  constructor(public navCtrl: NavController, private loginService: LoginService, private userService: UserService,
              private authService: AuthService, public appCtrl: App, public alertCtrl : AlertController,
              private programmeService: ProgrammeService, public modalCtrl: ModalController) { }

  ionViewDidLoad () {
    this.getUser();
  }

  /**
   * Get the user
   */
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

  /**
   * Display ObjectifsPreferencesPage to update the goals
   */
  updateObjectif(){
    let modal = this.modalCtrl.create(ObjectifsPreferencesPage);
    modal.present();
  }

  /**
   * Display LocationModalPage to update the location
   */
  updateLocalisation(){
    let modal = this.modalCtrl.create(LocationModalPage, {coords: this.user.location});
    modal.present();
  }

  /**
   * Call to generate a new programme
   */
  generateProgramme(){
    this.programmeService.generateProgramme().subscribe(() => {});
  }


  updateIdentifiants(){
    let modal = this.modalCtrl.create(IdentifiantsModalPage,this.getUser());
    modal.present();
  }

  /**
   * Logout the user, and go back to LoginPage
   */
  logout() {
    this.loginService.logout();
    this.logged = this.authService.isLogged();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }
}
