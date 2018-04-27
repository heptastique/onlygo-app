import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {Programme} from '../../entities/programme';
import {ProgrammeService} from '../../services/programme.service';


@Component({
  selector: 'page-programme',
  templateUrl: 'programme.html',
})
export class ProgrammePage {

  programme : Programme = {
    activites: null,
    user: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeService: ProgrammeService,
              public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    this.getProgramme();
  }

  getProgramme() {
    this.programmeService.getProgramme().subscribe(
      (programme) => {
        this.programme=programme;
      },
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
}
