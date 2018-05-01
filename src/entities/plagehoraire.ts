import { JourSemaine } from "./joursemaine";

export class PlageHoraire {
  id: number;
  heureDebut: number;
  heureFin: number;
  jour: JourSemaine;
  evaluation: number;
  date: Date;
  donneeAthmospherique: {
    id: number;
    indice: number;
    date: Date;
    main: {
      temp: number;
      temp_min: number;
    }
    wind: {
      speed: number;
      deg: "number";
    }
    weather: null;
    preciptation: number;
    temp: number;
    speed: number;
    deg: number;
    temp_max: number,
    temp_min: number;
  }
  nomJour: JourSemaine;
}
