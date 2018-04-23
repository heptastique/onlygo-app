import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {User} from "../entities/user";
import {API_SERVER} from "../app/app.constants";

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
}
