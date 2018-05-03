import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Activity} from '../entities/activity';
import {Gps_Coordinates} from '../entities/gps_coordinates';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService{

  constructor(private http: HttpClient) {}

  /**
   * Get the next activity of the user
   * @returns {Observable<Activity>}
   */
  getNextPlanned(): Observable<Activity>{
    const url = `${API_SERVER.activity}/nextPlanned`;
    return this.http.get<Activity>(url);
  }

  /**
   * Get the path of the next activity of the user
   * @param {number} idActivity
   * @returns {Observable<Gps_Coordinates[]>}
   */
  getItenary(idActivity: number): Observable<Gps_Coordinates []>{
    const url = `${API_SERVER.activity}/itinary`;
    let params = new HttpParams().set("activite",idActivity.toString());
    return this.http.get<Gps_Coordinates []>(url, {headers: httpOptions.headers, params: params})
    .map((result)=> result['pointCentreInteretList']);
  }
}
