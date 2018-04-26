import {Injectable} from '@angular/core';
import 'rxjs/add/observable/interval';
import { Geolocation } from '@ionic-native/geolocation';
import {Gpscoordinates} from '../entities/gpscoordinates';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class GeolocationService {

  sub;

  activityCoords : Gpscoordinates [] = [];

  constructor(private geolocation: Geolocation ) {
  }

  startRecording(time: number){
    this.sub = Observable.interval(time).subscribe( () =>
      {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.activityCoords.push(resp.coords);
          console.log(resp.coords);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      });
  }

  getPos(){
     this.geolocation.getCurrentPosition().then((resp) => {
      this.activityCoords.push(resp.coords);
      console.log(resp.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  stopRecording(){
    this.sub.unsubscribe();
  }

  getListCoord(): Gpscoordinates[]{
    return this.activityCoords;
  }
}
