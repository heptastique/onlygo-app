import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController, ViewController} from "ionic-angular";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'page-identifiants-modal',
  templateUrl: 'identifiants-modal.html',
})

export class IdentifiantsModalPage{

  email;
  password;
  passwordVerification;
  user;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              private userService: UserService,
              public toastCtrl: ToastController) {
    this.user = this.navParams;
  }

  validate(){
    //hypothese : tous les champs sont remplis
    this.user.email = this.email;
    this.user.password = this.password;
    this.userService.updateEmail(this.user)
      .subscribe(()=>{
        this.userService.updatePassword(this.user)
          .subscribe(()=>{
            //show success
            let toast = this.toastCtrl.create({
              message: 'Modifications enregistrées !',
              duration: 3000,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            toast.present();
            return this.viewCtrl.dismiss();
          },(err)=>{
            //erreur password
            console.log(err.error);
          });
    },(err) =>{
        //erreur email
        console.log(err.error);
      });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
