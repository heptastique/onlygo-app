import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {User} from "../entities/user";
import {API_SERVER} from "../app/app.constants";
import {Gps_Coordinates} from '../entities/gps_coordinates';
import { PreferenceSport } from "../entities/preference_sport";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  /**
   * Get all users
   * @returns {Observable<User[]>}
   */
  getAllUsers(): Observable<User[]>{
    const url = `${API_SERVER.user}/all`;
    return this.http.get<User[]>(url);
  }

  /**
   * Get the current user
   * @returns {Observable<User>}
   */
  getUser(): Observable<User>{
    const url = `${API_SERVER.user}`;
    return this.http.get<User>(url);
  }

  /**
   * Add an user
   * @param {User} user
   * @returns {Observable<User>}
   */
  addUser(user: User): Observable<User>{
    const url = `${API_SERVER.user}/add`;
    return this.http.post<User>(url, user, httpOptions);
  }

  /**
   * Update distance
   * @param {number} distance
   * @returns {Observable<any>}
   */
  updateObjectif(preference: PreferenceSport): Observable<any>{
    const url = `${API_SERVER.user}/objectif`;
    return this.http.put<any>(url, preference, httpOptions);
  }

  /**
   * Update distance max per session
   * @param {number} distance
   * @returns {Observable<any>}
   */
  updateDistanceMax(distance: number): Observable<any>{
    const url = `${API_SERVER.user}/maxDistance`;
    const payload = "{\"distance\":" + distance + "}";
    return this.http.put<any>(url, payload, httpOptions);
  }

  /**
   * Update location
   * @param {Gps_Coordinates} location
   * @returns {Observable<any>}
   */
  updateLocation(location: Gps_Coordinates):Observable<any>{
    const url = `${API_SERVER.user}/location`;
    return this.http.put<any>(url, location, httpOptions);
  }

  /**
   * Get the progression of the user
   * @returns {Observable<any>}
   */
  getProgression():Observable<any>{
    const url = `${API_SERVER.user}/progression`;
    return this.http.get<any>(url);
  }

  /**
   * Get the goals of the user
   * @returns {Observable<any>}
   */
  getObjectifs():Observable<any>{
    const url = `${API_SERVER.user}/objectif`;
    return this.http.get<any>(url);
  }

  getNombreSeances(): Observable<any> {
    const url = `${API_SERVER.user}/nbSessions`;
    return this.http.get<any>(url);
  }

  setNombreSeances(nbSeance: number): Observable<any> {
    const url = `${API_SERVER.user}/nbSessions`;
    return this.http.put<any>(url, {"nbSessions": nbSeance}, httpOptions);
  }
}
