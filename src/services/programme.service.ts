import {API_SERVER} from '../app/app.constants';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Programme} from '../entities/programme';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProgrammeService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get the current programme
   * @returns {Observable<Programme>}
   */
  getProgramme(): Observable<Programme> {
    const url = `${API_SERVER.programme}/active`;
    return this.http.get<Programme>(url);
  }

  /**
   * Get the program starting at date
   * @param {Date} date
   * @returns {Observable<Programme>}
   */
  getProgrammeByDate(date: Date):Observable<Programme>{
    const url = `${API_SERVER.programme}/getbydate`;
    let params = new HttpParams().set("date",date.toDateString());
    return this.http.get<Programme>(url, {headers: httpOptions.headers, params: params});
  }

  /**
   * Get the new generated program
   * @returns {Observable<any>}
   */
  generateProgramme():Observable<any>{
    const url = `${API_SERVER.programme}/generate`;
    return this.http.get<any>(url);
  }
}
