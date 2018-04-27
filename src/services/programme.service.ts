import {API_SERVER} from '../app/app.constants';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Programme} from '../entities/programme';

@Injectable()
export class ProgrammeService {

  constructor(private http: HttpClient) {
  }

  getProgramme(): Observable<Programme> {
    const url = `${API_SERVER.programme}/active`;
    return this.http.get<Programme>(url);
  }
}
