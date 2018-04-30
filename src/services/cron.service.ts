import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';

@Injectable()
export class CronService {

  constructor(private http: HttpClient) {
  }

  update(): Observable<any> {
    const url = `${API_SERVER.update}`;
    return this.http.get<any>(url);
  }

}
