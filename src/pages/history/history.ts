import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {DateService} from '../../services/date.service';
import {ProgrammeService} from '../../services/programme.service';
import {Programme} from '../../entities/programme';
import {Activity} from '../../entities/activity';

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

  activitesRealisees: Activity [] = [];

  programme : Programme = {
    activites: this.activites,
    user: null
  };

  bilanKcal: number = 0;
  bilanDistance: number = 0;

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

              this.bilanKcal = this.bilanKcal + this.programme.activites[i].distance * this.programme.activites[i].sport.kcalKm;
              this.bilanDistance += this.programme.activites[i].distance;
            }
          }
          this.bilanKcal = Math.round(this.bilanKcal*10)/10;
          this.bilanDistance = Math.round(this.bilanDistance*10)/10;
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
