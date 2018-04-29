
import {Injectable} from '@angular/core';

@Injectable()
export class DateService{

  jours: string [] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

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

  getCurrentWeek(): any {
    let date = new Date();
    let offset = date.getDay()-1;
    let firstDayDate = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let lastDayDate = new Date(firstDayDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let message = "du " + firstDayDate.getDate() + " " + this.mois[date.getMonth()] + " au " ;
    message += lastDayDate.getDate() + " " + this.mois[date.getMonth()] + " " + lastDayDate.getFullYear();
    return {date: firstDayDate, message: message};
  }

  getNextWeek(d: Date): any {
    let date = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
    let offset = date.getDay()-1;
    let firstDayDate = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let lastDayDate = new Date(firstDayDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let message = "du " + firstDayDate.getDate() + " " + this.mois[firstDayDate.getMonth()] + " au " ;
    message += lastDayDate.getDate() + " " + this.mois[lastDayDate.getMonth()] + " " + lastDayDate.getFullYear();
    return {date: firstDayDate, message: message};
  }

  getLastWeek(d: Date): any {
    let date = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
    let offset = date.getDay()-1;
    let firstDayDate = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let lastDayDate = new Date(firstDayDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let message = "du " + firstDayDate.getDate() + " " + this.mois[firstDayDate.getMonth()] + " au " ;
    message += lastDayDate.getDate() + " " + this.mois[lastDayDate.getMonth()] + " " + lastDayDate.getFullYear();
    return {date: firstDayDate, message: message};
  }

  getDateFromString(strDate: string): string{

    let date = new Date(strDate);

    let str = this.jours[date.getDay()] + " ";
    str += date.getDate() + " ";
    str += this.mois[date.getMonth()] + " ";

    return str;
  }
}
