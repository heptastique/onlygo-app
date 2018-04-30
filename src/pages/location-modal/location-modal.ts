import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {GeolocationService} from '../../services/geolocation.service';

declare var google;

@Component({
  selector: 'page-location-modal',
  templateUrl: 'location-modal.html',
})

export class LocationModalPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  gps_coordinates_settings : Gps_Coordinates;

  icon = '../../assets/icon/pin-icon.png';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private geolocationService: GeolocationService) {
  }

  ionViewDidLoad() {
    this.gps_coordinates_settings = this.navParams.get('coords');
    this.loadMap()
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }


  loadMap(){
    this.geolocationService.getPos().then((coords) =>
    {
      let myLatlng;
      if(this.gps_coordinates_settings === null){
        myLatlng = new google.maps.LatLng(coords.x, coords.y);
      }else{
        myLatlng = new google.maps.LatLng(this.gps_coordinates_settings.x, this.gps_coordinates_settings.y);
      }
      let mapOptions = {
        center: myLatlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


      let marker = new google.maps.Marker({
        map: this.map,
        position: this.map.getCenter(),
        animation: google.maps.Animation.DROP,
      });

      google.maps.event.addListener(this.map, 'click', (event) => {
        marker.setPosition(event.latLng);
        this.gps_coordinates_settings.x = event.latLng.lat();
        this.gps_coordinates_settings.y = event.latLng.lng();
        console.log(event.latLng.lng());
      });

      let content = "<h4>Ma position préférée</h4>";
      this.addInfoWindow(marker, content);
      this.addCurrentPos(coords);
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

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}
