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
    user: null,
    objectifs: null
  };

  bilanKcal: number = 0;
  bilanDistance: number = 0;

  loadProgress = null;

  constructor(public navCtrl: NavController, private dateService: DateService, private programmeService: ProgrammeService,
              public alertCtrl: AlertController) { }

  ionViewDidLoad(){
    this.displayCurrentWeek();
  }

  /**
   * Refresh the page
   * @param refresher
   */
  doRefresh(refresher) {
    this.getProgrammeByDate(this.week.date);
    refresher.complete();
  }

  /**
   * Display the current week
   */
  displayCurrentWeek(){
    this.week = this.dateService.getCurrentWeek();
    this.getProgrammeByDate(this.week.date);
  }

  /**
   * Get the next week of this.week
   */
  displayNextWeek(){
    this.week = this.dateService.getNextWeek(this.week.date);
    this.getProgrammeByDate(this.week.date);
  }

  /**
   * Get the last week of this.week
   */
  displayLastWeek(){
    this.week = this.dateService.getLastWeek(this.week.date);
    this.getProgrammeByDate(this.week.date);
  }

  /**
   * Get the program starting at the date
   * @param {Date} date
   */
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
              this.programme.activites[i].dateRealisee = this.dateService.getDateFromString(this.programme.activites[i].dateRealisee);
              this.programme.activites[i].distanceRealisee = Math.round(this.programme.activites[i].distanceRealisee*10)/10;
              this.bilanDistance += this.programme.activites[i].distanceRealisee;
              this.bilanKcal = this.bilanKcal + this.sumKcal(this.programme.activites[i]);
              this.activitesRealisees.push(this.programme.activites[i]);
            }
          }
          this.bilanKcal = Math.round(this.bilanKcal*10)/10;
          this.bilanDistance = Math.round(this.bilanDistance*10)/10;
          this.loadProgress = Math.round(this.bilanDistance/this.sumSportGoals(this.programme) * 100);
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

  /**
   * Get the Kcal of activity
   * @param {Activity} activity
   * @returns {number}
   */
  sumKcal(activity: Activity): number {
    return activity.distanceRealisee * activity.sport.kcalKm;
  }

  /**
   * Calculate the sum of all sports goals
   * @param {Programme} programme
   * @returns {number}
   */
  sumSportGoals(programme: Programme): number {
    let sum: number = 0;
    programme.objectifs.forEach(objectif => {
      sum += objectif.objectif;
    });
    return sum;
  }

}
