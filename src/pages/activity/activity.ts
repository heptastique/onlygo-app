import { Maps_Coordinates } from './../../entities/maps_coordinates';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, ToastController, NavParams,} from 'ionic-angular';
import {ActivityCreationPage} from '../activity-creation/activity-creation';
import {GeolocationService} from '../../services/geolocation.service';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {RealisationService} from '../../services/realisation.service';
import {Realisation} from '../../entities/realisation';
import {Observable} from 'rxjs/Rx';
import {ActivityService} from '../../services/activity.service';

declare var google;

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})

export class ActivityPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  objectif = 0;
  id = 0;
  loadProgress = 0;
  activityStarted = false;

  sub;
  coordsLog : Gps_Coordinates [] = [];
  pathGenerated;
  pathUser;

  i = 0;
  mapsCoords: Maps_Coordinates [] = [];
  generatedCoords: Gps_Coordinates [] = [];
  mapsGeneratedCoords: Maps_Coordinates [] = [];

  realisatation: Realisation = {
    distance: 0,
    date: new Date(),
    centreInteret: null
  };

  icon = '../../assets/icon/pin-icon.png';

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocationService: GeolocationService,
              private realisationService: RealisationService, public alertCtrl: AlertController,
              public toastCtrl: ToastController, private activityService: ActivityService) { }

  ionViewDidLoad() {
    this.objectif = this.navParams.get('objectif');
    this.id = this.navParams.get('id');
    console.log('r' + this.objectif);

    this.startActivity();
  }

  async startActivity(){
    this.activityStarted = true;
    this.coordsLog = [];
    this.mapsCoords = [];
    await this.loadMap();
    await this.getItenary();


    // Uncomment comments to simulate a movement
    this.sub = Observable.interval(1000).subscribe( () =>{
      this.geolocationService.getPos().then((coords) => {
        this.mapsCoords.push({'lat': coords.x /*+ this.i*/, 'lng': coords.y /*+ this.i */});
        // this.i += 0.01;
        this.pathUser.setPath(this.mapsCoords);
        this.coordsLog.push(coords);
        this.realisatation.distance = google.maps.geometry.spherical.computeLength(this.pathUser.getPath())/1000;
        if(Math.round(this.realisatation.distance/this.objectif)*100<100){
          this.loadProgress = Math.round(this.realisatation.distance/this.objectif)*100;
        }else{
          this.loadProgress = 100;
        }
      })
    });
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

  async loadMap(){
    return new Promise(resolve => {
      this.geolocationService.getPos().then((coords) =>
      {
        let latLng = new google.maps.LatLng(coords.x, coords.y);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.pathGenerated = new google.maps.Polyline({
          path: this.mapsGeneratedCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        this.pathUser = new google.maps.Polyline({
          path: this.mapsCoords,
          geodesic: true,
          strokeColor: '#000FFF',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        this.pathUser.setMap(this.map);
        this.pathGenerated.setMap(this.map);
        this.addCurrentPoint();

      resolve();
      });
    })
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

  async getItenary(){
    return new Promise(resolve => {
      this.activityService.getItenary(this.id).subscribe((coords) => {
        for(let points of coords){
          this.mapsGeneratedCoords.push({'lat': points.x, 'lng': points.y});
          this.pathGenerated.setPath(this.mapsGeneratedCoords);
        }
        console.log(this.mapsGeneratedCoords);
        resolve();
      });
    });
  }
}
