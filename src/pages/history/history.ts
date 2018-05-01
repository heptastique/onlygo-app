import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {DateService} from '../../services/date.service';
import {ProgrammeService} from '../../services/programme.service';
import {Programme} from '../../entities/programme';
import {Activity} from '../../entities/activity';
import { Realisation } from '../../entities/realisation';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  aDate = new Date();

  week = {
    message: "",
    date: this.aDate
  };

  activites: Activity [] = [];

  realisations: Realisation [] = [];

  activitesRealisees: Activity [] = [];

  programme : Programme = {
    activites: this.activites,
    realisations: this.realisations,
    user: null,
    objectifDistance: null
  };

  bilanKcal: number = 0;
  bilanDistance: number = 0;

  loadProgress = null;

  constructor(public navCtrl: NavController, private dateService: DateService, private programmeService: ProgrammeService,
              public alertCtrl: AlertController) { }

  ionViewDidLoad(){
    this.displayCurrentWeek();
  }

  displayCurrentWeek(){
    this.week = this.dateService.getCurrentWeek();
    this.getProgrammeByDate(this.week.date);
  }

  displayNextWeek(){
    this.week = this.dateService.getNextWeek(this.week.date);
    this.getProgrammeByDate(this.week.date);
  }

  displayLastWeek(){
    this.week = this.dateService.getLastWeek(this.week.date);
    this.getProgrammeByDate(this.week.date);
  }

  getProgrammeByDate(date: Date){
    this.programmeService.getProgrammeByDate(date).subscribe(
      (programme) => {
        this.bilanKcal = 0;
        this.bilanDistance = 0;
        this.activitesRealisees = [];
        this.programme=programme;
        if(this.programme !== null){
          for(let i in this.programme.activites){
            if(this.programme.activites[i].estRealisee){
              this.programme.activites[i].date = this.dateService.getDateFromString(this.programme.activites[i].date);
              this.programme.activites[i].distance = Math.round(this.programme.activites[i].distance*10)/10;

              this.activitesRealisees.push(this.programme.activites[i]);
            }
          }
          for(let i in this.programme.realisations) {
            this.programme.realisations[i].date = this.dateService.getDateFromString(this.programme.realisations[i].date);
            this.programme.realisations[i].distance = Math.round(this.programme.realisations[i].distance*10)/10;
            this.bilanDistance += this.programme.realisations[i].distance;
            this.bilanKcal = this.bilanKcal + this.programme.activites[i].distance * 73.333336; // Un problème ?
          }
          this.bilanKcal = Math.round(this.bilanKcal*10)/10;
          this.bilanDistance = Math.round(this.bilanDistance*10)/10;
          this.loadProgress = Math.round(this.bilanDistance/this.programme.objectifDistance * 100)
          if(this.loadProgress > 100) {
            this.loadProgress = 100;
          }
        }else{
          this.loadProgress = null;
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
