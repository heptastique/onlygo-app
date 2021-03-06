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
    x: null,
    y: null
  };

  constructor(private geolocation: Geolocation ) {
  }

  /**
   * Records the user location every time ms and save it in activityCoords
   * @param {number} time
   */
  startRecording(time: number){
    this.sub = Observable.interval(time).subscribe( () =>
      {
        this.geolocation.getCurrentPosition().then((resp) => {
          let coord : Gps_Coordinates = {
            x : resp.coords.latitude,
            y : resp.coords.longitude
          };

          this.activityCoords.push(coord);
          console.log(resp.coords);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      });
  }

  /**
   * Get the current position
   * @returns {Promise<Gps_Coordinates>}
   */
  getPos():Promise<Gps_Coordinates>{
    this.coord.x = null;
    this.coord.y = null;
    return this.geolocation.getCurrentPosition().then((resp) => {
       this.coord.x = resp.coords.latitude;
       this.coord.y = resp.coords.longitude;
       //console.log(this.coord);
       return this.coord;
     });
  }

  /**
   * Stop the recording
   */
  stopRecording(){
    this.sub.unsubscribe();
  }

  /**
   * Return activityCoords
   * @returns {Gps_Coordinates[]}
   */
  getListCoord(): Gps_Coordinates[]{
    return this.activityCoords;
  }
}
