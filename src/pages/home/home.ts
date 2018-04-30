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
import { ActivityCreationPage } from '../activity-creation/activity-creation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  color =  'black';
  thumbup =  true;
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
    location: null
  };

  activity: Activity = {
    sport: null,
    distance: null,
    date: null,
    programmeId: null,
    estRealisee: null,
    centreInteret: null
  };
  nextActivity = false;
  dateStr = "";

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController,
              private evaluationService: EvaluationService, private activityService: ActivityService,
              private dateService: DateService, public createActivitySheet: ActionSheetController) {}

  ionViewDidEnter() {
    this.getUser();
    this.getEvaluation();
    this.getProgression();
    this.getNextActivity();
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
        this.evaluation = evaluation;
        if(this.evaluation.note<0.5){
          this.thumbup = false;
          this.color='red';
        }else{
          this.thumbup = true;
          this.color='green';
        }},
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
        this.activity = activity;
        this.dateStr = this.dateService.getDateFromString(this.activity.date);
        this.activity.distance = Math.round(this.activity.distance*10)/10;
        this.nextActivity = true;
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
    this.navCtrl.push(ActivityPage)
  }

  presentActionSheet() {
    let actionSheet = this.createActivitySheet.create({
      title: 'Effectuer une activité',
      buttons: [
        {
          text: 'Commencer l\'activité du jour',
          handler: () => {
            this.recordActivity();
          }
        },{
          text: 'Ajouter une activité réalisée',
          handler: () => {
            this.addActivity();
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
}

