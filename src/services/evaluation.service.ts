import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {API_SERVER} from '../app/app.constants';
import {Evaluation} from '../entities/evaluation';

@Injectable()
export class SportService {

  constructor(private http: HttpClient) {
  }

  getEvaluationNow(): Observable<Evaluation> {
    const url = `${API_SERVER.evaluation}/now`;
    return this.http.get<Evaluation>(url);
  }
  
}
