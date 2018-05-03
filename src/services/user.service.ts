import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {User} from "../entities/user";
import {API_SERVER} from "../app/app.constants";
import {Gps_Coordinates} from '../entities/gps_coordinates';

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
  updateObjectif(distance: number): Observable<any>{
    const url = `${API_SERVER.user}/objectif`;
    const payload = "{\"distance\":" + distance + "}";
    return this.http.put<any>(url, payload, httpOptions);
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

  getProgression():Observable<any>{
    const url = `${API_SERVER.user}/progression`;
    return this.http.get<any>(url);
  }

  /**
   * Updates user email
   * @param {String} email
   * @returns {Observable<any>}
   */
  updateEmail(user : User):Observable<any>{
    const url = `${API_SERVER.user}/email`;
    return this.http.put<any>(url, user, httpOptions);
  }

  /**
   * Updates user password
   * @param {User} user
   * @returns {Observable<any>}
   */
  updatePassword(user: User):Observable<any>{
    const url = `${API_SERVER.user}/password`;
    return this.http.put<any>(url, user, httpOptions);
  }
}
