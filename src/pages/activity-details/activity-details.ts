import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Activity} from '../../entities/activity';
import {ActivityService} from '../../services/activity.service';
import {Sport} from '../../entities/sport';
import {DateService} from '../../services/date.service';

@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage {

  sport : Sport = {
    nom : "",
    kcalKm: null,
    kmH: null,
    id: null
  };

  activity: Activity = {
    sport: this.sport,
    distance: null,
    date: null,
    programmeId: null,
    estRealisee: null
  };
  activityTime = 0;
  kcal = 0;
  dateStr;

  constructor(public navCtrl: NavController, public navParams: NavParams, private activityService: ActivityService,
              private dateService: DateService) { }

  ionViewDidLoad() {
    this.activityService.getNextPlanned().subscribe(activity => {
      this.activity = activity;
      this.dateStr = this.dateService.getDateFromString(this.activity.date);
      this.activityTime = Math.round( 60 * this.activity.distance / this.activity.sport.kmH);
      this.kcal = Math.round(this.activity.distance * this.activity.sport.kcalKm);
    });
  }

}
