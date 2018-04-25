import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { User } from "../../entities/user";
import { UserService } from "../../services/user.service";
import {ActivityCreationPage} from '../activity-creation/activity-creation';
import {EvaluationService} from '../../services/evaluation.service';
import {Evaluation} from '../../entities/evaluation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  color =  'black';
  thumbup =  true;
  evaluation: Evaluation;

  loadProgress = 50;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: ""
  };

  constructor(public alertCtrl: AlertController, private userService: UserService, private navCtrl: NavController,
              private evaluationService: EvaluationService) { }

  ionViewDidLoad () {
    this.getUser();
    this.getEvaluation();
  }

  getEvaluation(){
    this.evaluationService.getEvaluationNow().subscribe(
      evaluation => {
        this.evaluation = evaluation;
        console.log(this.evaluation.note);
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
      .subscribe(user => { this.user = user; },
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
    this.navCtrl.push(ActivityCreationPage);
  }
}

