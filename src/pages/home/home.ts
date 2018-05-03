import { Component } from '@angular/core';
import {AlertController, NavController, ActionSheetController, ModalController} from 'ionic-angular';
import { User } from "../../entities/user";
import { UserService } from "../../services/user.service";
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
import { InfoIndicePage } from '../info-indice/info-indice';
import { ProgrammeService } from '../../services/programme.service';
import { Programme } from '../../entities/programme';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  gaugeTypePollution = "semi";
  gaugeValuePollution = 0;

  gaugeTypeIndice = "arch";
  gaugeValueIndice = 0;
  gaugeLabelIndice = "Indice";
  gaugeThickIndice = "10";
  gaugeCapIndice = "round";

  thresholdConfigPollution = {
    '0': {color: '#32B8A3'},
    '10': {color: '#5CCB60'},
    '20': {color: '#99E600'},
    '30': {color: '#C3F000'},
    '40': {color: '#FFFF00'},
    '50': {color: '#FFD100'},
    '60': {color: '#FFAA00'},
    '70': {color: '#FF5E00'},
    '80': {color: '#FF0000'},
    '90': {color: '#800000'},
  };

  thresholdConfigIndice = {
    '90': {color: '#32B8A3'},
    '80': {color: '#5CCB60'},
    '70': {color: '#99E600'},
    '60': {color: '#C3F000'},
    '50': {color: '#FFFF00'},
    '40': {color: '#FFD100'},
    '30': {color: '#FFAA00'},
    '20': {color: '#FF5E00'},
    '10': {color: '#FF0000'},
    '0': {color: '#800000'},
  };

  loadProgress = 0;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    objectifs: [],
    objectifHebdoCourse: null,
    objectifHebdoMarche: null,
    objectifHebdoCyclisme: null,
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
    id: null,
    sport: this.sport,
    distancePrevue: 0,
    distanceRealisee: 0,
    datePrevue: "",
    dateRealisee: "",
    programmeId: null,
    estRealisee: null,
    centreInteret: null,
    timeFrame: null,
    tauxCompletion: null
  };

  nextActivity = false;
  dateStr = "";

  plageHoraire = null;

  evaluationPourcentage = null;

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController,
              private activityService: ActivityService, private dateService: DateService,
              private plageHoraireService: PlageHoraireService, public createActivitySheet: ActionSheetController,
              public modalCtrl: ModalController, public programmeService: ProgrammeService) {}


  ionViewDidEnter() {
    this.nextActivity = false;
    this.getUser();
    this.getProgression();
    this.getNextActivity();
    this.getPlageActuelle();
  }

  doRefresh(refresher) {
    this.nextActivity = false;
    this.getUser();
    this.getProgression();
    this.getNextActivity();
    this.getPlageActuelle();
    refresher.complete();
  }

  getProgression(){
    this.programmeService.getProgramme().subscribe(programme => {
      var sommeDistance = 0;
      programme.activites.forEach(activity => {
        if(activity.estRealisee) {
          sommeDistance += activity.distanceRealisee;
        }
      })
      this.loadProgress = Math.round(sommeDistance/this.sumSportGoals(programme)*100);
    })
  }

  getPlageActuelle() {
    this.plageHoraireService.getEvaluationNow().subscribe(plageHoraire => {
      console.log(plageHoraire);
      this.plageHoraire = plageHoraire;
      this.plageHoraire.donneeAthmospherique.indice = this.plageHoraire.donneeAthmospherique.indice.toFixed(2);
      this.gaugeValuePollution = Math.round(this.plageHoraire.donneeAthmospherique.indice);
      this.gaugeValueIndice = Math.round(this.plageHoraire.evaluation * 100)
    })
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user;
        if(user.objectifs.length === 0) {
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
          this.dateStr = this.dateService.getDateFromString(this.activity.datePrevue);
          this.activity.distancePrevue = Math.round(this.activity.distancePrevue*10)/10;
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
    this.navCtrl.push(ActivityPage, {'objectif': this.activity.distancePrevue, 'id': this.activity.id});
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
          text: 'Réaliser la prochaine actvité',
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

  infoIndice(){
    let modal = this.modalCtrl.create(InfoIndicePage);
    modal.present();
  }

  sumSportGoals(programme: Programme): number {
    var sum: number = 0;
    programme.objectifs.forEach(objectif => {
      sum += objectif.objectif;
    });
    return sum;
  }
}

