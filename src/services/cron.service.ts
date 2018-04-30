import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_SERVER} from '../app/app.constants';

@Injectable()
export class CronService {

  constructor(private http: HttpClient) {
  }

  update() {
    const url = `${API_SERVER.update}`;
    this.http.get(url);
  }

}
