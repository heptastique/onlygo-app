import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController,} from 'ionic-angular';
import {ActivityCreationPage} from '../activity-creation/activity-creation';
import {GeolocationService} from '../../services/geolocation.service';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {RealisationService} from '../../services/realisation.service';
import {Realisation} from '../../entities/realisation';

declare var google;

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})

export class ActivityPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  activityStarted = false;

  coordsLog : Gps_Coordinates [] = [];

  realisatation: Realisation = {
    distance: 0,
    date: new Date()
  };

  icon = '../../assets/icon/pin-icon.png';

  constructor(public navCtrl: NavController, private geolocationService: GeolocationService,
              private realisationService: RealisationService, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
  }

  startActivity(){
    this.activityStarted = true;
    this.coordsLog = [];
    this.loadMap();
    this.geolocationService.startRecording(1000);
  }

  stopActivity(){
    this.activityStarted = false;
    this.geolocationService.stopRecording();
    this.coordsLog = this.geolocationService.getListCoord();
    // TODO
    // this.realisatation.distance
    this.realisatation.date = new Date();
    this.realisationService.addRealisation(this.realisatation).subscribe(() => {
      let alert = this.alertCtrl.create({
        title: 'Réalisation enregistrée !',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.popToRoot();
    });
    this.map = null;
  }

  addActivity() {
    this.navCtrl.push(ActivityCreationPage);
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
