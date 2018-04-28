import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Activity} from '../../entities/activity';
import {ActivityService} from '../../services/activity.service';
import {Sport} from '../../entities/sport';
import {DateService} from '../../services/date.service';
import {GeolocationService} from '../../services/geolocation.service';

declare var google;

@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

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
              private dateService: DateService, private geolocationService: GeolocationService) { }

  ionViewDidLoad() {
    this.activityService.getNextPlanned().subscribe(activity => {
      this.activity = activity;
      this.dateStr = this.dateService.getDateFromString(this.activity.date);
      this.activityTime = Math.round( 60 * this.activity.distance / this.activity.sport.kmH);
      this.kcal = Math.round(this.activity.distance * this.activity.sport.kcalKm);
    });
    this.loadMap();
  }

  loadMap(){
    this.geolocationService.getPos().then((coords) =>
    {
      let latLng = new google.maps.LatLng(coords.x, coords.y);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addCurrentPoint();
    });
  }

  addCurrentPoint(){
    let marker = new google.maps.Marker({
      map: this.map,
      position: this.map.getCenter(),
      animation: google.maps.Animation.DROP,
      color: 'blue'
    });

    let content = "<h4>Ma localisation</h4>";

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

}
