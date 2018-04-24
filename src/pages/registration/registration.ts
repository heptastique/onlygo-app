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
    email: ""
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
      this.navCtrl.pop();
    },
      (err) =>{
        console.error(err);
        let alert = this.alertCtrl.create({
          title: 'Erreur lors de l\'inscription.',
          subTitle: err.error.message,
          buttons: ['OK']
        });
        alert.present();
      });
  }

}
