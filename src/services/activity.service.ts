import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {HttpClient} from '@angular/common/http';
import {Activity} from '../entities/activity';


@Injectable()
export class ActivityService{

  constructor(private http: HttpClient) {}

  getNextPlanned(): Observable<Activity>{
    const url = `${API_SERVER.activity}/nextPlanned`;
    return this.http.get<Activity>(url);
  }
}
