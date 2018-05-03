import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_SERVER} from '../app/app.constants';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CronService {

  constructor(private http: HttpClient) {
  }

  update(): Observable<any> {
    const url = `${API_SERVER.update}`;
    return this.http.get(url);
  }

  strava(): Observable<any>{
    const url = `${API_SERVER.strava}`;
    return this.http.get(url);
  }

}
