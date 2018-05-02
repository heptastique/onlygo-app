import {Sport} from './sport';
import {Centre_Interet} from './centre_interet';

export class Activity{
  sport: Sport;
  distancePrevue: number;
  distanceRealisee: number;
  datePrevue: any;
  dateRealisee: any;
  programmeId: number;
  estRealisee: boolean;
  centreInteret: Centre_Interet;
}
