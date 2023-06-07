import {
  InformationMessage,
  ItemMessage,
  ExperienceMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
} from './Message';
import { Information, information } from './Information';
import { debounce } from './Util';

const informationTip = debounce(information.tip);
const informationAlert = debounce(information.alert);

export { Information, information, informationTip, informationAlert };
export type {
  InformationMessage,
  ItemMessage,
  ExperienceMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
};
