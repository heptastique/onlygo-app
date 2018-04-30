import {API_SERVER} from '../app/app.constants';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Programme} from '../entities/programme';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProgrammeService {

  constructor(private http: HttpClient) {
  }

  getProgramme(): Observable<Programme> {
    const url = `${API_SERVER.programme}/active`;
    return this.http.get<Programme>(url);
  }

  getProgrammeByDate(date: Date):Observable<Programme>{
    const url = `${API_SERVER.programme}/getbydate`;
    return this.http.post<Programme>(url, {'dateDebut' : date}, httpOptions);
  }
}
