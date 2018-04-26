import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { User } from "../../entities/user";
import { UserService } from "../../services/user.service";
import {ActivityCreationPage} from '../activity-creation/activity-creation';
import {GeolocationService} from '../../services/geolocation.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  loadProgress = 50;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: ""
  };

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController,
              private geolocationService: GeolocationService) {}


  ionViewDidLoad () {
    this.getUser();
    this.geolocationService.startRecording(5000);
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => { this.user = user; },
        (err) => {
          console.error(err);
          let alert = this.alertCtrl.create({
            title: 'La requête a échoué.',
            subTitle: 'Vous devez être authentifié pour accéder à cette ressource.',
            buttons: ['OK']
          });
          alert.present();
        });
  }

  createActivity(): void{
    this.navCtrl.push(ActivityCreationPage);
    this.geolocationService.stopRecording();
    console.log(this.geolocationService.getListCoord());
  }
}

