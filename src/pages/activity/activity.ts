import { Maps_Coordinates } from './../../entities/maps_coordinates';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, ToastController, NavParams,} from 'ionic-angular';
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
  userLatLng;
  pathGenerated;
  pathUser;

  mapsCoords: Maps_Coordinates [] = [];
  generatedCoords: Gps_Coordinates [] = [];
  mapsGeneratedCoords: Maps_Coordinates [] = [];
  directionsService;
  directionsDisplayStart;

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
    this.startActivity();
  }

  /**
   * Start the activity and records the user movement
   * @returns {Promise<void>}
   */
  async startActivity(){
    this.activityStarted = true;
    this.coordsLog = [];
    this.mapsCoords = [];
    await this.loadMap();
    await this.getItenary();

    // Every second, call to getPos() and update the path on the map
    this.sub = Observable.interval(1000).subscribe( () =>{
      this.geolocationService.getPos().then((coords) => {
        this.mapsCoords.push({'lat': coords.x , 'lng': coords.y});
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

  /**
   * Stop activity. Stop the recording and save the realisation.
   */
  stopActivity(){
    this.activityStarted = false;
    this.sub.unsubscribe();
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

  /**
   * Load the map with its options.
   * @returns {Promise}
   */
  async loadMap(){
    return new Promise(resolve => {
      this.geolocationService.getPos().then((coords) =>
      {
        this.userLatLng = new google.maps.LatLng(coords.x, coords.y);
        let mapOptions = {
          center: this.userLatLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.directionsDisplayStart =  new google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: "green"
          }
        });
        this.directionsService = new google.maps.DirectionsService;
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.directionsDisplayStart.setMap(this.map);
        this.directionsDisplayStart.setOptions( { suppressMarkers: true } );

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

  /**
   * Add the current position of the user as a marker
   */
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

  /**
   * Add info to the marker
   * @param marker
   * @param content
   */
  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  /**
   *Get the path generated by the back-end, display it and generate path to the activity thanks to google maps api
   */
  async getItenary(){
    return new Promise(resolve => {
      this.activityService.getItenary(this.id).subscribe((coords) => {
        for(let points of coords){
          this.mapsGeneratedCoords.push({'lat': points.x, 'lng': points.y});
          this.pathGenerated.setPath(this.mapsGeneratedCoords);
        }
        this.mapsGeneratedCoords.shift();
        let firstPoint = this.mapsGeneratedCoords.shift();
        this.mapsGeneratedCoords.pop(); // Don't need it as its the userPoint
        let lastPoint = this.mapsGeneratedCoords.pop();

        this.pathGenerated.setPath(this.mapsGeneratedCoords);
        this.pathGenerated.setMap(this.map);
        this.calculateAndDisplayRoute(this.userLatLng, firstPoint, lastPoint, this.directionsDisplayStart);
        resolve();
      });
    });
  }

  /**
   * Calculate paths
   * @param userPoint
   * @param firstPoint
   * @param lastPoint
   * @param directionsDisplay
   */
  calculateAndDisplayRoute(userPoint, firstPoint, lastPoint, directionsDisplay) {
    this.directionsService.route({
      origin: userPoint,
      destination: firstPoint,
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status == 'OK') {
       directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    this.createMarker(firstPoint, 'Début activité', 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    this.createMarker(lastPoint, 'Fin activité', 'http://maps.google.com/mapfiles/ms/icons/red-dot.png');
  }

  /**
   * Creating marker
   * @param latlng
   * @param title
   * @param icon
   */
  createMarker(latlng, title, icon) {
    let marker = new google.maps.Marker({
      position: latlng,
      title: title,
      map: this.map,
      icon: icon
    });
    this.addInfoWindow(marker, title);
  }
}
