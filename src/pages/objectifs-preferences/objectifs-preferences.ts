import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { ObjectifSport } from '../../entities/objectif_sport';
import { PreferenceSport } from '../../entities/preference_sport';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-objectifs-preferences',
  templateUrl: 'objectifs-preferences.html',
})
export class ObjectifsPreferencesPage {

  course: PreferenceSport = {
    sportId: 1,
    distance: null
  }

  marche: PreferenceSport = {
    sportId: 2,
    distance: null
  }

  cyclisme: PreferenceSport = {
    sportId: 3,
    distance: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public userService: UserService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObjectifsPreferencesPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    let loading = this.loadingCtrl.create({
      content: 'Mise à jour en cours...'
    });
    loading.present();
    this.userService.updateObjectif(this.course).subscribe(res => {
      this.userService.updateObjectif(this.marche).subscribe(res => {
        this.userService.updateObjectif(this.cyclisme).subscribe(res => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Objectifs enregistrés',
            duration: 3000,
            showCloseButton: true,
            closeButtonText: 'Ok'
          });
          toast.present();
          this.viewCtrl.dismiss();
        });
      });
    });
  }

}
