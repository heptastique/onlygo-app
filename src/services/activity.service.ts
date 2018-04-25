import {Injectable} from '@angular/core';
import {Activity} from '../entities/activity';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ActivityService{

  constructor(private http: HttpClient) {}

  addActivity(activity: Activity): Observable<Activity>{
    const url = `${API_SERVER.activity}/add`;
    return this.http.post<Activity>(url, activity, httpOptions);
  }
}
