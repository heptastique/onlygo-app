
import {Injectable} from '@angular/core';

@Injectable()
export class DateService{

  jours: string [] = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  mois: string [] = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout",
    "septembre", "octobre", "novembre", "decembre"];

  constructor() {}

  getCurrentDate(): string {

    let date = new Date();

    let str = this.jours[date.getDay()] + " ";
    str += date.getDate() + " ";
    str += this.mois[date.getMonth()] + " ";

    return str;
  }

  getDateFromString(strDate: string): string{

    let date = new Date(strDate);

    let str = this.jours[date.getDay()] + " ";
    str += date.getDate() + " ";
    str += this.mois[date.getMonth()] + " ";

    return str;
  }
}
