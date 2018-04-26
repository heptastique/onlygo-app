import {Injectable} from '@angular/core';
import {ActivityDTO} from '../entities/activityDTO';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService{

  constructor(private http: HttpClient) {}

  addActivity(activity: ActivityDTO): Observable<ActivityDTO>{
    const url = `${API_SERVER.activity}/add`;
    return this.http.post<ActivityDTO>(url, activity, httpOptions);
  }
}
