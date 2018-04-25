import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {User} from "../../entities/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  passwordVerification;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    objectif: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService,
              public alertCtrl: AlertController) { }

  ionViewDidLoad() { }

  register(){
    if(this.user.password != this.passwordVerification){
      let alert = this.alertCtrl.create({
        title: 'Les mots de passes ne sont pas identiques.',
        subTitle: '',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.userService.addUser(this.user).subscribe((user) => {
      this.user = user;
        let alert = this.alertCtrl.create({
          title: 'Registration success!',
          buttons: ['OK']
        });
        alert.present();
      this.navCtrl.pop();
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
          title: 'Erreur lors de l\'inscription.',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      });
  }

}
