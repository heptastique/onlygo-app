import { Component } from '@angular/core';
import {  NavController,  } from 'ionic-angular';
import {ActivityCreationPage} from '../activity-creation/activity-creation';
import {GeolocationService} from '../../services/geolocation.service';
import {Gps_Coordinates} from '../../entities/gps_coordinates';


@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})

export class ActivityPage {

  activityStarted = false;

  coordsLog : Gps_Coordinates [] = [];

  constructor(public navCtrl: NavController, private geolocationService: GeolocationService) {
  }

  ionViewDidLoad() {
  }

  startActivity(){
    this.activityStarted = true;
    this.coordsLog = [];
    this.geolocationService.startRecording(1000);
  }

  stopActivity(){
    this.activityStarted = false;
    this.geolocationService.stopRecording();
    this.coordsLog = this.geolocationService.getListCoord();
  }

  addActivity() {
    this.navCtrl.push(ActivityCreationPage);
  }
}