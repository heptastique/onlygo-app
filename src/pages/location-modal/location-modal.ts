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
  current_gps_coords: Gps_Coordinates;

  currentAsSetting: boolean;

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
        this.currentAsSetting = true;
      }else{
        myLatlng = new google.maps.LatLng(this.gps_coordinates_settings.x, this.gps_coordinates_settings.y);
        this.currentAsSetting = false;
      }
      let mapOptions = {
        center: myLatlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      if(this.currentAsSetting){
        let content = "<h4>Ma position courrante est ma position préférée</h4>";
        this.addSettingsMarker(content);
      }else{
        let content = "<h4>Ma position préférée</h4>";
        this.addSettingsMarker(content);
        this.addCurrentPos(coords);
      }
    });
  }

  addSettingsMarker(content){
    let marker = new google.maps.Marker({
      map: this.map,
      position: this.map.getCenter(),
      animation: google.maps.Animation.DROP,
    });

    this.addInfoWindow(marker, content);
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
