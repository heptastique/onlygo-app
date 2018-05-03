import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Activity} from '../../entities/activity';
import {ActivityService} from '../../services/activity.service';
import {Sport} from '../../entities/sport';
import {DateService} from '../../services/date.service';
import {GeolocationService} from '../../services/geolocation.service';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {Centre_Interet} from '../../entities/centre_interet';
import {PlageHoraire} from '../../entities/plagehoraire';
import {JourSemaine} from '../../entities/joursemaine';
import {Maps_Coordinates} from '../../entities/maps_coordinates';
import {UserService} from '../../services/user.service';

declare var google;

@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  mapsGeneratedCoords: Maps_Coordinates [] = [];
  pathGenerated;

  sport : Sport = {
    nom: "",
    kcalKm: null,
    kmH: null,
    id: null
  };

  timeFrame: PlageHoraire = {
    id: null,
    heureDebut: 0,
    heureFin: 0,
    jour: null,
    evaluation: null,
    date: null,
    donneeAthmospherique: null,
    nomJour: null
  };

  centreInteret: Centre_Interet={
    name: "",
    point: null
  };

  activity: Activity = {
    id: null,
    sport: this.sport,
    distancePrevue: null,
    distanceRealisee: null,
    datePrevue: null,
    dateRealisee: null,
    programmeId: null,
    estRealisee: null,
    centreInteret: this.centreInteret,
    timeFrame: this.timeFrame,
    tauxCompletion: null
  };


  activityTime = 0;
  kcal = 0;
  dateStr;

  icon = '../../assets/icon/pin-icon.png';

  constructor(public navCtrl: NavController, public navParams: NavParams, private activityService: ActivityService,
              private dateService: DateService, private geolocationService: GeolocationService,
              private userService: UserService) { }

  ionViewDidLoad() {
    this.activityService.getNextPlanned().subscribe(activity => {
      this.activity = activity;
      this.dateStr = this.dateService.getDateFromString(this.activity.datePrevue);
      this.activityTime = Math.round( 60 * this.activity.distancePrevue / this.activity.sport.kmH);
      this.activity.distancePrevue = Math.round(this.activity.distancePrevue*10)/10;
      this.kcal = Math.round(this.activity.distancePrevue * this.activity.sport.kcalKm);
      this.loadMap();
    });
  }

  loadMap(){
    this.geolocationService.getPos().then((coords) => {
      this.userService.getUser().subscribe((user) => {
        let myLatlng = new google.maps.LatLng(user.location.x, user.location.y);
        let mapOptions = {
          center: myLatlng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        let directionsDisplayStart = new google.maps.DirectionsRenderer;
        let directionsDisplayEnd = new google.maps.DirectionsRenderer;
        let directionsService = new google.maps.DirectionsService;
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        directionsDisplayStart.setMap(this.map);
        directionsDisplayEnd.setMap(this.map);
        directionsDisplayStart.setOptions( { suppressMarkers: true } );
        directionsDisplayEnd.setOptions( { suppressMarkers: true } );

        this.pathGenerated = new google.maps.Polyline({
          path: this.mapsGeneratedCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });


        this.getItenary(directionsService, directionsDisplayStart, directionsDisplayEnd);

        this.addCurrentPos(coords);
        this.addUserPos(user);
      });
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

  addUserPos(user){
      let myLatlng = new google.maps.LatLng(user.location.x, user.location.y);

      let marker = new google.maps.Marker({
        map: this.map,
        position: myLatlng,
        animation: google.maps.Animation.DROP,
      });

      let content = "<h4>Lieu de départ</h4>";

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

  getItenary(directionsService, directionsDisplayStart, directionsDisplayEnd){
      this.activityService.getItenary(this.activity.id).subscribe((coords) => {
        for(let points of coords){
          this.mapsGeneratedCoords.push({'lat': points.x, 'lng': points.y});
        }
        let userPoint = this.mapsGeneratedCoords.shift();
        let firstPoint = this.mapsGeneratedCoords.shift();
        this.mapsGeneratedCoords.pop(); // Don't need it as its the userPoint
        let lastPoint = this.mapsGeneratedCoords.pop();

        this.pathGenerated.setPath(this.mapsGeneratedCoords);
        this.pathGenerated.setMap(this.map);
        this.calculateAndDisplayRoute(directionsService, directionsDisplayStart, userPoint, firstPoint, 'Depart utilisateur', 'Arrivée activité');
        this.calculateAndDisplayRoute(directionsService, directionsDisplayEnd, lastPoint, userPoint, 'Depart activitée', 'Arrivée utilisateur');
    });
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, start, end, startStr, endStr) {
    directionsService.route({
      origin: start,
      destination: end,
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    this.createMarker(start, startStr);
    this.createMarker(end, endStr);
  }

  createMarker(latlng, title) {

    let marker = new google.maps.Marker({
      position: latlng,
      title: title,
      map: this.map
    });

    this.addInfoWindow(marker, title);
  }
}
