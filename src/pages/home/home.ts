import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { User } from "../../entities/user";
import { UserService } from "../../services/user.service";
import {EvaluationService} from '../../services/evaluation.service';
import {Evaluation} from '../../entities/evaluation';
import {ActivityPage} from '../activity/activity';
import {ProgrammePage} from '../programme/programme';
import {PreferencesPage} from '../preferences/preferences';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  color =  'black';
  thumbup =  true;
  evaluation: Evaluation ={
    note: null
  };

  loadProgress = 50;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    objectifHebdo: null,
    location: null
  };

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController,
              private evaluationService: EvaluationService) {}


  ionViewDidLoad () {
    this.getUser();
    this.getEvaluation();
  }

  getEvaluation(){
    this.evaluationService.getEvaluationNow().subscribe(
      evaluation => {
        if(evaluation == null){
          let alert = this.alertCtrl.create({
            title: 'La requête a échoué.',
            subTitle: 'Pas de note',
            buttons: ['OK']
          });
          alert.present();
          return;
        }
        this.evaluation = evaluation;
        if(this.evaluation.note<0.5){
          this.thumbup = false;
          this.color='red';
        }else{
          this.thumbup = true;
          this.color='green';
        }},
      (err) => {
        console.error(err);
        let alert = this.alertCtrl.create({
          title: 'La requête a échoué.',
          subTitle: 'Vous devez être authentifié pour accéder à cette ressource.',
          buttons: ['OK']
        });
        alert.present();
      });
  }

  getUser(): void {
    this.userService.getUser()
      .subscribe(user => {
        this.user = user;
        if(user.objectifHebdo === -1.0 || user.objectifHebdo === 0.0 ){
          let alert = this.alertCtrl.create({
            title: 'Objectif non détecté',
            subTitle: 'Ajoutez un objectif',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.setRoot(PreferencesPage);
                }
              }
            ]
          });
          alert.present();
        }
        },
        (err) => {
          console.error(err);
          let alert = this.alertCtrl.create({
            title: 'La requête a échoué.',
            subTitle: 'Vous devez être authentifié pour accéder à cette ressource.',
            buttons: ['OK']
          });
          alert.present();
        });
  }

  createActivity(): void{
    this.navCtrl.push(ActivityPage);
  }

  seeProgramme(){
    this.navCtrl.push(ProgrammePage);
  }
}

