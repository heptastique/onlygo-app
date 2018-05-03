import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import { PlageHoraire } from '../entities/plagehoraire';

@Injectable()
export class PlageHoraireService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get the current timeframe
   * @returns {Observable<PlageHoraire>}
   */
  getEvaluationNow(): Observable<PlageHoraire> {
    const url = `${API_SERVER.plagehoraire}/now`;
    return this.http.get<PlageHoraire>(url);
  }

}
