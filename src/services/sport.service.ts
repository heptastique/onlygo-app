import {Injectable} from '@angular/core';
import {Sport} from '../entities/sport';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class SportService{

  constructor(private http: HttpClient) {}

  getAllSports(sports: Sport[]): Observable<Sport[]>{
    const url = `${API_SERVER.sport}/all`;
    return this.http.get<Sport[]>(url);
  }
}
