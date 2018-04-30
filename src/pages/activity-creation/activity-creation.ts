import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {RealisationService} from '../../services/realisation.service';
import {Realisation} from '../../entities/realisation';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../entities/activity';
import {Sport} from '../../entities/sport';
import {Centre_Interet} from '../../entities/centre_interet';
import {DateService} from '../../services/date.service';

@Component({
  selector: 'page-activity-creation',
  templateUrl: 'activity-creation.html',
})
export class ActivityCreationPage {

  realisation: Realisation = {
    distance: 0,
    date: new Date()
  };

  centreInteret : Centre_Interet = {
    name: "",
    point: null
  };

  sport : Sport = {
    id: null,
    nom: '',
    kcalKm: null,
    kmH: null
  };

  activity: Activity = {
    sport: this.sport,
    distance: null,
    date: null,
    programmeId: null,
    estRealisee: null,
    centreInteret: this.centreInteret
  };

  dateStr = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private realisationService: RealisationService,
              public alertCtrl:AlertController, private activityService: ActivityService, private dateService: DateService) {
  }

  ionViewDidLoad() {
    this.getNextActivity();
  }

  getNextActivity(){
    this.activityService.getNextPlanned().subscribe((activity) => {
      this.activity = activity;
      this.dateStr = this.dateService.getDateFromString(this.activity.date);})
  }

  validate(){
    this.realisationService.addRealisation(this.realisation).subscribe(
      () => {
        let alert = this.alertCtrl.create({
          title: 'Réalisation enregistrée !',
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.popToRoot();
      },
      (err) =>{
        console.error(err);
        let message;
        if(err.status == 0) {
          message = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
        }else{
          message = err.error;
        }
        let alert = this.alertCtrl.create({
          title: 'Erreur lors de l\'enregistrement.',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      });
  }
}
