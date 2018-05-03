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
    this.user.password = this.password;
    //if we can get the former email value we can compare to avoid useless calls to the back
    if(this.email===""){
      return this.updatePassword();
    }else{
      this.user.email = this.email;
      this.userService.updateEmail(this.user)
        .subscribe(()=>{
          return this.updatePassword()
        },(err) =>{
          let toast = this.toastCtrl.create({
            message: 'Cette adresse mail est indisponible!',
            duration: 3000,
            showCloseButton: true,
            closeButtonText: 'Ok'
          });
          toast.present();
        });
    }
  }

  updatePassword(){
    if(this.password===this.passwordVerification){
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
    }else{
      let toast = this.toastCtrl.create({
        message: 'Les mots de passe doivent être identiques !',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    }
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
