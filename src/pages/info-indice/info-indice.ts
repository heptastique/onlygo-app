import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-info-indice',
  templateUrl: 'info-indice.html',
})
export class InfoIndicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() { }

  /**
   * Dismiss the view
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
