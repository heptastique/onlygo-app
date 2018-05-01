import { Maps_Coordinates } from './../../entities/maps_coordinates';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, ToastController,} from 'ionic-angular';
import {ActivityCreationPage} from '../activity-creation/activity-creation';
import {GeolocationService} from '../../services/geolocation.service';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {RealisationService} from '../../services/realisation.service';
import {Realisation} from '../../entities/realisation';
import {Observable} from 'rxjs/Rx';

declare var google;

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})

export class ActivityPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  activityStarted = false;

  sub;
  coordsLog : Gps_Coordinates [] = [];
  path;

  i = 0;
  mapsCoords: Maps_Coordinates [] = [];

  realisatation: Realisation = {
    distance: 0,
    date: new Date()
  };

  icon = '../../assets/icon/pin-icon.png';

  constructor(public navCtrl: NavController, private geolocationService: GeolocationService,
              private realisationService: RealisationService, public alertCtrl: AlertController,
              public toastCtrl: ToastController) { }

  ionViewDidLoad() {
    this.startActivity();
  }

  startActivity(){
    this.activityStarted = true;
    this.coordsLog = [];
    this.loadMap();

    this.sub = Observable.interval(1000).subscribe( () =>{
      this.geolocationService.getPos().then((coords) => {
        this.mapsCoords.push({'lat': coords.x + this.i, 'lng': coords.y + this.i });
        this.i += 0.01;
        console.log(this.mapsCoords);
        this.path.setPath(this.mapsCoords);
      })
    });
    //this.geolocationService.startRecording(1000);
  }

  stopActivity(){
    this.activityStarted = false;
    this.sub.unsubscribe();
    // TODO
    // this.realisatation.distance
    this.realisatation.date = new Date();
    this.realisationService.addRealisation(this.realisatation).subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'Réalisation enregistrée !',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
      this.navCtrl.popToRoot();
    });
    this.map = null;
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

      this.path = new google.maps.Polyline({
        path: this.mapsCoords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      this.path.setMap(this.map);
      this.addCurrentPoint();
    });
  }

  addCurrentPoint(){
    let marker = new google.maps.Marker({
      map: this.map,
      position: this.map.getCenter(),
      animation: google.maps.Animation.DROP,
      icon: this.icon
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
