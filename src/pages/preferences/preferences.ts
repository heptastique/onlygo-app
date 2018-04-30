import { Component } from '@angular/core';
import { AlertController, App, NavController  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {GeolocationService} from '../../services/geolocation.service';
import {ProgrammeService} from '../../services/programme.service';

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
    objectifHebdo: null,
    location: null
  };

  logged = false;

  constructor(public navCtrl: NavController, private loginService: LoginService, private userService: UserService,
              private authService: AuthService, public appCtrl: App, public alertCtrl : AlertController,
              private geolocationService: GeolocationService, private programmeService: ProgrammeService) { }

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
    let alert = this.alertCtrl.create({
      title: 'Objectif',
      inputs: [
        {
          name: 'objectif',
          type: 'number',
          min: '0',
          value: this.user.objectifHebdo.toString()
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Valider',
          handler: data => {
            this.userService.updateObjectif(data.objectif).subscribe(
              (res) => {
                this.user.objectifHebdo = res.distance;
                this.generateProgramme();
                },
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
        }
      ]
    });
    alert.present();
  }

  updateLocalisation(){
    if(this.user.location === null){
     this.geolocationService.getPos().then(
       (coords)=> {
         this.promptLocation(coords, "Localisation actuelle par défaut");
       });
    }else{
      this.promptLocation(this.user.location, "Localisation");
    }
  }

  generateProgramme(){
    this.programmeService.generateProgramme().subscribe(() => {});
  }

  promptLocation(coords: Gps_Coordinates, title: string){
    let alert = this.alertCtrl.create({
      title: title,
      inputs: [
        {
          name: 'x',
          type: 'number',
          min: '0',
          value: coords.x.toString()
        },
        {
          name: 'y',
          type: 'number',
          min: '0',
          value: coords.y.toString()
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Valider',
          handler: data => {
            let coor : Gps_Coordinates = {
              x: data.x,
              y: data.y
            }
            this.userService.updateLocation(coor).subscribe(
              (res) => { this.user.location = res.location },
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
        }
      ]
    });
    alert.present();
  }

  logout() {
    this.loginService.logout();
    this.logged = this.authService.isLogged();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }
}
