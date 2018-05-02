import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ToastController} from 'ionic-angular';
import {RealisationService} from '../../services/realisation.service';
import {Realisation} from '../../entities/realisation';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../entities/activity';
import {Sport} from '../../entities/sport';
import {Centre_Interet} from '../../entities/centre_interet';
import {DateService} from '../../services/date.service';
import {ActivityDetailsPage} from '../activity-details/activity-details';

@Component({
  selector: 'page-activity-creation',
  templateUrl: 'activity-creation.html',
})
export class ActivityCreationPage {

  realisation: Realisation = {
    distance: 0,
    date: new Date(),
    centreInteret: null
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
    distancePrevue: null,
    distanceRealisee: null,
    datePrevue: null,
    dateRealisee: null,
    programmeId: null,
    estRealisee: null,
    centreInteret: this.centreInteret,
    timeFrame: null,
    tauxCompletion: null
  };

  dateStr = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private realisationService: RealisationService,
              public alertCtrl:AlertController, private activityService: ActivityService, private dateService: DateService,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.getNextActivity();
  }

  getNextActivity(){
    this.activityService.getNextPlanned().subscribe((activity) => {
      this.activity = activity;
      this.dateStr = this.dateService.getDateFromString(this.activity.datePrevue);})
  }

  validate(){
    this.realisationService.addRealisation(this.realisation).subscribe(
      () => {
        let toast = this.toastCtrl.create({
          message: 'Réalisation enregistrée !',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
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
        let toast = this.toastCtrl.create({
          message: 'Erreur lors de l\'enregistrement : ' + message,
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      });
  }

  seeDetails(){
    this.navCtrl.push(ActivityDetailsPage);
  }
}
