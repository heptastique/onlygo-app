import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {GeolocationService} from '../../services/geolocation.service';
import {UserService} from '../../services/user.service';

declare var google;

@Component({
  selector: 'page-location-modal',
  templateUrl: 'location-modal.html',
})

export class LocationModalPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  gps_coordinates_settings : Gps_Coordinates;

  gps_current_pos: Gps_Coordinates;

  icon = '../../assets/icon/pin-icon.png';

  marker;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private geolocationService: GeolocationService, public alertCtrl: AlertController, private userService: UserService) {
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
      this.gps_current_pos = coords;
      let myLatlng;
      if(this.gps_coordinates_settings === null){
        myLatlng = new google.maps.LatLng(coords.x, coords.y);
        this.gps_coordinates_settings = coords;
      }else{
        myLatlng = new google.maps.LatLng(this.gps_coordinates_settings.x, this.gps_coordinates_settings.y);
      }
      let mapOptions = {
        center: myLatlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


      this.marker = new google.maps.Marker({
        map: this.map,
        position: this.map.getCenter(),
        animation: google.maps.Animation.DROP,
      });

      google.maps.event.addListener(this.map, 'click', (event) => {
        this.marker.setPosition(event.latLng);
        this.gps_coordinates_settings.x = event.latLng.lat();
        this.gps_coordinates_settings.y = event.latLng.lng();
      });

      let content = "<h4>Ma position préférée</h4>";
      this.addInfoWindow(this.marker, content);
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

  validate(){
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Confirmer cette nouvelle localisation de départ ?',
      buttons: [
        {
          text: 'Non',
        },
        {
          text: 'oui',
          handler: () => {
            this.userService.updateLocation(this.gps_coordinates_settings).subscribe(
              (res) => { this.dismiss(); },
              (err) => {
                let message;
                if(err.status == 0) {
                  message = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
                }else{
                  message = err.error;
                }
                let alert = this.alertCtrl.create({
                  title: 'Erreur lors de la mise à jour.',
                  subTitle: message,
                  buttons: ['OK']
                });
                alert.present();
              });
          }
        }
      ]
    });
    confirm.present();
  }

  setCurrentPos(){
    let myLatlng = new google.maps.LatLng(this.gps_current_pos.x, this.gps_current_pos.y);
    this.marker.setPosition(myLatlng);
    this.gps_coordinates_settings.x = this.gps_current_pos.x;
    this.gps_coordinates_settings.y = this.gps_current_pos.y;
  }
}
