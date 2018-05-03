import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ToastController, ViewController} from "ionic-angular";
import {UserService} from "../../services/user.service";
import {User} from '../../entities/user';

@Component({
  selector: 'page-identifiants-modal',
  templateUrl: 'identifiants-modal.html',
})

export class IdentifiantsModalPage{

  formerEmail;
  passwordVerification;

  user: User = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    objectifs: [],
    objectifHebdoCourse: null,
    objectifHebdoMarche: null,
    objectifHebdoCyclisme: null,
    distanceMax: null,
    location: null
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              private userService: UserService,
              public toastCtrl: ToastController,) {

  }

  validate(){
    //hypothese : tous les champs sont remplis
    //if we can get the former email value we can compare to avoid useless calls to the back
    if(this.user.email===this.formerEmail){
      return this.updatePassword();
    }else{
      this.userService.updateEmail(this.user)
        .subscribe(()=>{
          return this.updatePassword();
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
    if(this.user.password===this.passwordVerification){
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
          this.viewCtrl.dismiss();
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

  getUser(){
    this.userService.getUser().subscribe((user)=> {
      this.user = user;
      this.formerEmail = user.email;
    })
  }
}
