import {Injectable} from '@angular/core';
import 'rxjs/add/observable/interval';
import { Geolocation } from '@ionic-native/geolocation';
import {Gps_Coordinates} from '../entities/gps_coordinates';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class GeolocationService {

  sub;

  activityCoords : Gps_Coordinates [] = [];

  coord: Gps_Coordinates = {
    latitude: null,
    longitude: null
  };

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

  getPos():Gps_Coordinates{
     this.geolocation.getCurrentPosition().then((resp) => {
      this.coord = resp.coords;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
     return this.coord;
  }

  stopRecording(){
    this.sub.unsubscribe();
  }

  getListCoord(): Gps_Coordinates[]{
    return this.activityCoords;
  }
}
