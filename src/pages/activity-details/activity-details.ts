import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Activity} from '../../entities/activity';
import {ActivityService} from '../../services/activity.service';
import {Sport} from '../../entities/sport';
import {DateService} from '../../services/date.service';
import {GeolocationService} from '../../services/geolocation.service';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {Centre_Interet} from '../../entities/centre_interet';

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

  centreInteret: Centre_Interet={
    name: "",
    point: null
  };

  activity: Activity = {
    sport: this.sport,
    distance: null,
    date: null,
    programmeId: null,
    estRealisee: null,
    centreInteret: this.centreInteret
  };


  activityTime = 0;
  kcal = 0;
  dateStr;

  icon = '../../assets/icon/pin-icon.png';

  constructor(public navCtrl: NavController, public navParams: NavParams, private activityService: ActivityService,
              private dateService: DateService, private geolocationService: GeolocationService) { }

  ionViewDidLoad() {
    this.activityService.getNextPlanned().subscribe(activity => {
      this.activity = activity;
      this.dateStr = this.dateService.getDateFromString(this.activity.date);
      this.activityTime = Math.round( 60 * this.activity.distance / this.activity.sport.kmH);
      this.activity.distance = Math.round(this.activity.distance*10)/10;
      this.kcal = Math.round(this.activity.distance * this.activity.sport.kcalKm);
      this.loadMap();
    });
  }

  loadMap(){
    this.geolocationService.getPos().then((coords) =>
    {
      let myLatlng = new google.maps.LatLng(this.activity.centreInteret.point.x, this.activity.centreInteret.point.y);
      let mapOptions = {
        center: myLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addCurrentPos(coords);
      this.addActivityPos(this.activity.centreInteret.point);
    });
  }

  addCurrentPos(gps_coords: Gps_Coordinates ){
    let myLatlng = new google.maps.LatLng(gps_coords.x, gps_coords.y);
    let marker = new google.maps.Marker({
      map: this.map,
      position: myLatlng,
      animation: google.maps.Animation.DROP,
      icon: this.icon
    });

    let content = "<h4>Ma localisation</h4>";

    this.addInfoWindow(marker, content);
  }

  addActivityPos(gps_coords: Gps_Coordinates){
    let myLatlng = new google.maps.LatLng(gps_coords.x, gps_coords.y);

    let marker = new google.maps.Marker({
      map: this.map,
      position: myLatlng,
      animation: google.maps.Animation.DROP,
    });

    let content = "<h4>Lieu de l'activité</h4>";

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
