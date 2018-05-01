import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {User} from "../../entities/user";
import {UserService} from "../../services/user.service";
import { GeolocationService } from '../../services/geolocation.service';

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
    objectifHebdo: null,
    distanceMax: null,
    location: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService,
              public alertCtrl: AlertController, private geolocationService: GeolocationService,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController) { }

  ionViewDidLoad() { }

  async register(){
    let loading = this.loadingCtrl.create({
      content: 'Inscription en cours...'
    });
    loading.present();
    if(this.user.password != this.passwordVerification){
      let alert = this.alertCtrl.create({
        title: 'Les mots de passes ne sont pas identiques.',
        subTitle: '',
        buttons: ['OK']
      });
      loading.dismiss();
      alert.present();
      return;
    }
    await this.geolocationService.getPos().then(location => {
      return new Promise(resolve => {
        this.user.location = location;
        resolve();
      })
    })
    await this.userService.addUser(this.user).subscribe((user) => {
      this.user = user;
      let toast = this.toastCtrl.create({
        message: 'Inscription réussie ! Vous pouvez vous connecter',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      loading.dismiss();
      toast.present();
      this.navCtrl.pop();
    },
      (err) =>{
        console.error(err);
        loading.dismiss();
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
