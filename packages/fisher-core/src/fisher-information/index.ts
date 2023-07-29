import {
  InformationMessage,
  ItemMessage,
  ExperienceMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
} from './Message.js';
import { Information, information } from './Information.js';
import { debounce as debounceInformation } from './Util.js';
import { debounce } from '../utils/index.js';

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
