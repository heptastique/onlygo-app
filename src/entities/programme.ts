import {User} from './user';
import {Activity} from './activity';
import { ObjectifSport } from './objectif_sport';

export class Programme{
  activites: Activity[];
  user: User;
  objectifs: ObjectifSport[];
}
