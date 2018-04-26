import {Gps_Coordinates} from './gps_coordinates';

export class User{
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  objectifHebdo: number;
  location: Gps_Coordinates;
}
