import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {Programme} from '../../entities/programme';
import {ProgrammeService} from '../../services/programme.service';
import {DateService} from '../../services/date.service';


@Component({
  selector: 'page-programme',
  templateUrl: 'programme.html',
})
export class ProgrammePage {

  programme : Programme = {
    activites: null,
    user: null,
    objectifDistance: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeService: ProgrammeService,
              public alertCtrl: AlertController, private dateService: DateService) { }

  ionViewDidLoad() {
    this.getProgramme();
  }

  getProgramme() {
    this.programmeService.getProgramme().subscribe(
      (programme) => {
        this.programme=programme;
        for(let i in this.programme.activites){
          this.programme.activites[i].date = this.dateService.getDateFromString(this.programme.activites[i].date);
          this.programme.activites[i].distance = Math.round(this.programme.activites[i].distance*10)/10;
        }
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
