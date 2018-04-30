import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-location-modal',
  templateUrl: 'location-modal.html',
})
export class LocationModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
