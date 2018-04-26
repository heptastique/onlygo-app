import {User} from './user';
import {Activity} from './activity';
import {Realisation} from './realisation';

export class Programme{
  activites: Activity[];
  user: User;
  realisations: Realisation[];
}
