import {Activity} from './activity';
import {User} from './user';
import {Realisation} from './realisation';

export class Programme{
  activities: Activity[];
  user: User;
  realisations: Realisation[];
}
