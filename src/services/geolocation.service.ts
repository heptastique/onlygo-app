import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/interval';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

@Injectable()
export class GeolocationService {

  sub;

  options: PositionOptions = {
    timeout: 1000
  };

  constructor(private http: HttpClient, private geolocation: Geolocation ) {
  }

  startRecording(time: number){
    this.options.timeout = time;
    this.sub = this.geolocation.watchPosition(this.options)
      .filter((p) => p.coords !== undefined) //Filter Out Errors
      .subscribe(position => {
        console.log(position.coords.longitude + ' ' + position.coords.latitude);
      });
  }

  stopRecording(){
    this.sub.unsubscribe();
  }
}
