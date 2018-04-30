import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Gps_Coordinates} from '../../entities/gps_coordinates';
import {GeolocationService} from '../../services/geolocation.service';


@Component({
  selector: 'page-location-modal',
  templateUrl: 'location-modal.html',
})
export class LocationModalPage {

  gps_coordinates : Gps_Coordinates;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private geolocationService: GeolocationService) {
  }

  ionViewDidLoad() {
    this.gps_coordinates = this.navParams.get('coords');
    this.update();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  update(){
    if(this.gps_coordinates === null){
      this.geolocationService.getPos().then(
        (coords)=> {
        });
    }else{
    }
  }
}
