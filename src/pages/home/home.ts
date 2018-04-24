import { Component } from '@angular/core';
import {AlertController } from 'ionic-angular';
import {User} from "../../entities/user";
import {UserService} from "../../services/user.service";

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

  constructor(public alertCtrl: AlertController, private userService: UserService) { }

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
            subTitle: 'Vous devez être authentifié.',
            buttons: ['OK']
          });
          alert.present();
        });
  }
}

