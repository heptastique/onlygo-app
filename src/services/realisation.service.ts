import {Injectable} from '@angular/core';
import {Realisation} from '../entities/realisation';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RealisationService{

  constructor(private http: HttpClient) {}

  addActivity(realisation: Realisation): Observable<Realisation>{
    const url = `${API_SERVER.realisation}/add`;
    return this.http.post<Realisation>(url, realisation, httpOptions);
  }
}
