import { Maps_Coordinates } from './../../entities/maps_coordinates';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, ToastController, NavParams,} from 'ionic-angular';
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

  objectif = 0;
  loadProgress = 0;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocationService: GeolocationService,
              private realisationService: RealisationService, public alertCtrl: AlertController,
              public toastCtrl: ToastController) { }

  ionViewDidLoad() {
    this.objectif = this.navParams.get('objectif');
    console.log('r' + this.objectif);
    this.startActivity();
  }

  async startActivity(){
    this.activityStarted = true;
    this.coordsLog = [];
    this.mapsCoords = [];
    await this.loadMap();


    // Uncomment comments to simulate a movement
    this.sub = Observable.interval(1000).subscribe( () =>{
      this.geolocationService.getPos().then((coords) => {
        this.mapsCoords.push({'lat': coords.x /*+ this.i*/, 'lng': coords.y /*+ this.i*/ });
        // this.i += 0.01;
        this.path.setPath(this.mapsCoords);
        this.coordsLog.push(coords);
        this.realisatation.distance = google.maps.geometry.spherical.computeLength(this.path.getPath())/1000;
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

        this.path = new google.maps.Polyline({
          path: this.mapsCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        this.path.setMap(this.map);
        this.addCurrentPoint();

        /*google.maps.LatLng.prototype.kmTo = function(a){
          var e = Math, ra = e.PI/180;
          var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
          var g = this.lng() * ra - a.lng() * ra;
          var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos
          (c) * e.pow(e.sin(g/2), 2)));
          return f * 6378.137;
      }

      google.maps.Polyline.prototype.inKm = function(n){
          var a = this.getPath(n), len = a.getLength(), dist = 0;
          for (var i=0; i < len-1; i++) {
            dist += a.getAt(i).kmTo(a.getAt(i+1));
          }
          return dist;
      }*/
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
}
