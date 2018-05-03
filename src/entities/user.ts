import {Gps_Coordinates} from './gps_coordinates';
import { ObjectifSport } from './objectif_sport';

export class User{
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  objectifs: ObjectifSport[];
  objectifHebdoCourse: number;
  objectifHebdoMarche: number;
  objectifHebdoCyclisme: number;
  nbSessions: number;
  location: Gps_Coordinates;
}
