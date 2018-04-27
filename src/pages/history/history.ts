import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DateService} from '../../services/date.service';

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


  constructor(public navCtrl: NavController, private dateService: DateService) { }

  ionViewDidLoad(){
    this.displayCurrentWeek();
  }

  displayCurrentWeek(){
    this.week = this.dateService.getCurrentWeek();
  }

  displayNextWeek(){
    this.week = this.dateService.getNextWeek(this.week.date);
  }

  displayLastWeek(){
    this.week = this.dateService.getLastWeek(this.week.date);
  }
}
