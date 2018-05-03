import {Sport} from './sport';
import {Centre_Interet} from './centre_interet';
import {PlageHoraire} from './plagehoraire';

export class Activity{
  id: number;
  sport: Sport;
  distancePrevue: number;
  distanceRealisee: number;
  datePrevue: any;
  dateRealisee: any;
  programmeId: number;
  estRealisee: boolean;
  centreInteret: Centre_Interet;
  timeFrame: PlageHoraire;
  tauxCompletion: number;
}
