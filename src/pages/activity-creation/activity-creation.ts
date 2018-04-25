import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../entities/activity';



@Component({
  selector: 'page-activity-creation',
  templateUrl: 'activity-creation.html',
})
export class ActivityCreationPage {

  activity: Activity = {
    sport: null,
    programme: null,
    distance: 0,
    date: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private activityService: ActivityService,
              public alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
  }

  validate(){
    this.activityService.addActivity(this.activity).subscribe(
      () => {
        let alert = this.alertCtrl.create({
          title: 'Activité enregistré !',
          buttons: ['OK']
        });
        alert.present();
      },
      (err) =>{
        console.error(err);
        let message;
        if(err.status == 0) {
          message = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion.';
        }else{
          message = err.error;
        }
        let alert = this.alertCtrl.create({
          title: 'Erreur lors de l\'enregistrement.',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      });
  }
}
