
import {Injectable} from '@angular/core';

@Injectable()
export class DateService{

  jours: string [] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  mois: string [] = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout",
    "septembre", "octobre", "novembre", "decembre"];

  constructor() {}

  /**
   * Return the current date as a french string
   * @returns {string}
   */
  getCurrentDate(): string {
    let date = new Date();
    let str = this.jours[date.getDay()] + " ";
    str += date.getDate() + " ";
    str += this.mois[date.getMonth()] + " ";
    return str;
  }

  /**
   * Return the curent week with the first date of the week and as a french string
   * @returns {any}
   */
  getCurrentWeek(): any {
    let date = new Date();
    let offset = date.getDay()-1;
    let firstDayDate = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let lastDayDate = new Date(firstDayDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let message = "du " + firstDayDate.getDate() + " " + this.mois[date.getMonth()] + " au " ;
    message += lastDayDate.getDate() + " " + this.mois[date.getMonth()] + " " + lastDayDate.getFullYear();
    return {date: firstDayDate, message: message};
  }

  /**
   * Return the next week of d with the first date of the week and as a french string
   * @returns {any}
   */
  getNextWeek(d: Date): any {
    let date = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
    let offset = date.getDay()-1;
    let firstDayDate = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let lastDayDate = new Date(firstDayDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let message = "du " + firstDayDate.getDate() + " " + this.mois[firstDayDate.getMonth()] + " au " ;
    message += lastDayDate.getDate() + " " + this.mois[lastDayDate.getMonth()] + " " + lastDayDate.getFullYear();
    return {date: firstDayDate, message: message};
  }

  /**
   * Return the last week of d with the first date of the week and as a french string
   * @returns {any}
   */
  getLastWeek(d: Date): any {
    let date = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
    let offset = date.getDay()-1;
    let firstDayDate = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let lastDayDate = new Date(firstDayDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    let message = "du " + firstDayDate.getDate() + " " + this.mois[firstDayDate.getMonth()] + " au " ;
    message += lastDayDate.getDate() + " " + this.mois[lastDayDate.getMonth()] + " " + lastDayDate.getFullYear();
    return {date: firstDayDate, message: message};
  }

  /**
   * Return the french string of the strDate
   * @param {string} strDate
   * @returns {string}
   */
  getDateFromString(strDate: string): string{
    let date = new Date(strDate);
    let str = this.jours[date.getDay()] + " ";
    str += date.getDate() + " ";
    str += this.mois[date.getMonth()] + " ";
    return str;
  }
}
