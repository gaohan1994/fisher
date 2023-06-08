import {
  InformationMessage,
  ItemMessage,
  ExperienceMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
} from './Message';
import { Information, information } from './Information';
import { debounce as debounceInformation } from './Util';
import { debounce } from '../utils';

const informationTip = debounceInformation(information.tip);
const informationAlert = debounceInformation(information.alert);
const informationLoading = debounce(information.loading, 500, true);

export { Information, information, informationTip, informationAlert, informationLoading };
export type {
  InformationMessage,
  ItemMessage,
  ExperienceMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
};
