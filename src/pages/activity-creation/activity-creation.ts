import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../entities/activity';
import {Sport} from '../../entities/sport';
import {SportService} from '../../services/sport.service';



@Component({
  selector: 'page-activity-creation',
  templateUrl: 'activity-creation.html',
})
export class ActivityCreationPage {

  activity: Activity = {
    sportName: null,
    programmeId: null,
    distance: 0,
    date: null
  };

  sports: Sport[]

  constructor(public navCtrl: NavController, public navParams: NavParams, private activityService: ActivityService,
              public alertCtrl:AlertController, private sportService: SportService) {
  }

  ionViewDidLoad() {
    this.getAllSports();
  }

  getAllSports(){
    this.sportService.getAllSports().subscribe(
      (sports) => {
        this.sports = sports;
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
          title: 'Erreur lors de la requête.',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      }
    )
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
