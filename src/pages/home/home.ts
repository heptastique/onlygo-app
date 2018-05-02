import { Component } from '@angular/core';
import {AlertController, NavController, ActionSheetController} from 'ionic-angular';
import { User } from "../../entities/user";
import { UserService } from "../../services/user.service";
import {EvaluationService} from '../../services/evaluation.service';
import {Evaluation} from '../../entities/evaluation';
import {ActivityPage} from '../activity/activity';
import {ProgrammePage} from '../programme/programme';
import {PreferencesPage} from '../preferences/preferences';
import {ActivityDetailsPage} from '../activity-details/activity-details';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../entities/activity';
import {DateService} from '../../services/date.service';
import { PlageHoraireService } from '../../services/plagehoraire.service';
import { ActivityCreationPage } from '../activity-creation/activity-creation';
import { Sport } from '../../entities/sport';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  gaugeType = "semi";
  gaugeValue = 80;

  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };


  evaluation: Evaluation ={
    note: null
  };

  loadProgress = 0;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    objectifHebdo: null,
    distanceMax: null,
    location: null
  };

  sport: Sport = {
    nom: "",
    kcalKm: null,
    kmH: null,
    id: null
  };

  activity: Activity = {
    sport: this.sport,
    distance: 0,
    date: "",
    programmeId: null,
    estRealisee: null,
    centreInteret: null
  };



  nextActivity = false;
  dateStr = "";

  plageHoraire = null;

  evaluationPourcentage = null;

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController,
              private evaluationService: EvaluationService, private activityService: ActivityService,
              private dateService: DateService, private plageHoraireService: PlageHoraireService,
              public createActivitySheet: ActionSheetController) {}


  ionViewDidEnter() {
    this.nextActivity = false;
    this.getUser();
    this.getEvaluation();
    this.getProgression();
    this.getNextActivity();
    this.getPlageActuelle();
  }

  doRefresh(refresher) {
    this.nextActivity = false;
    this.getUser();
    this.getEvaluation();
    this.getProgression();
    this.getNextActivity();
    this.getPlageActuelle();
    refresher.complete();
  }

  getProgression(){
    this.userService.getProgression().subscribe(
      (data) => {
        if(data.progression > 100){
          this.loadProgress  = 100;
        }else{
          this.loadProgress = Math.round(data.progression);
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

  getEvaluation(){
    this.evaluationService.getEvaluationNow().subscribe(
      evaluation => {
        if(evaluation == null){
          let alert = this.alertCtrl.create({
            title: 'La requête a échoué.',
            subTitle: 'Pas de note',
            buttons: ['OK']
          });
          alert.present();
          return;
        }
        this.evaluation = evaluation;},
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

  getPlageActuelle() {
    this.plageHoraireService.getEvaluationNow().subscribe(plageHoraire => {
      console.log(plageHoraire);
      this.plageHoraire = plageHoraire;
      this.plageHoraire.donneeAthmospherique.indice = this.plageHoraire.donneeAthmospherique.indice.toFixed(2);
      this.evaluationPourcentage = Math.round(this.plageHoraire.evaluation * 100)
    })
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user;
        if(user.objectifHebdo === -1.0 || user.objectifHebdo === 0.0 ){
          let alert = this.alertCtrl.create({
            title: 'Objectif non détecté',
            subTitle: 'Ajoutez un objectif',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.setRoot(PreferencesPage);
                }
              }
            ]
          });
          alert.present();
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

  getNextActivity(){
    this.activityService.getNextPlanned().subscribe(
      (activity) => {
        if(activity !== null){
          this.activity = activity;
          this.dateStr = this.dateService.getDateFromString(this.activity.date);
          this.activity.distance = Math.round(this.activity.distance*10)/10;
          this.nextActivity = true;
        }
      },
      (err) => {
        console.error(err);
      });
  }

  createActivity(): void{
    this.navCtrl.push(ActivityPage);
  }

  seeProgramme(){
    this.navCtrl.push(ProgrammePage);
  }

  seeDetails(){
    this.navCtrl.push(ActivityDetailsPage);
  }

  addActivity() {
    this.navCtrl.push(ActivityCreationPage);
  }

  recordActivity() {
    this.navCtrl.push(ActivityPage, {'objectif': this.activity.distance});
  }

  presentActionSheet() {
    let actionSheet = this.createActivitySheet.create({
      title: 'Effectuer une activité',
      buttons: [
        {
          text: 'Commencer l\'activité du jour',
          icon: 'pulse',
          handler: () => {
            this.recordActivity();
          }
        },{
          text: 'Ajouter une activité réalisée',
          icon: 'add',
          handler: () => {
            this.addActivity();
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          icon: 'close',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
}

