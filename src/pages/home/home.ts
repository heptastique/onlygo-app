import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { User } from "../../entities/user";
import { UserService } from "../../services/user.service";
import {ActivityCreationPage} from '../activity-creation/activity-creation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  color =  'yellow';

  thumbup =  true;

  loadProgress = 50;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: ""
  };

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController) { }

  ionViewDidLoad () {
    this.getUser();
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
  }
}

