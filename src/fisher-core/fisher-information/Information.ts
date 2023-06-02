import { EventEmitter } from 'smar-util';
import { ExperienceMessage, InformationMessage, ItemMessage, MasterDeathMessage, MasterLevelMessage } from './Message';
import { FisherMessageVariant } from './Constants';

enum InformationEventKeys {
  TipMessage = 'TipMessage',
  AlertMessage = 'AlertMessage',
}

class Information {
  public static instance: Information;

  public static readonly InformationEventKeys = InformationEventKeys;

  public name = '消息';

  public static create(): Information {
    if (!Information.instance) {
      Information.instance = new Information();
    }
    return Information.instance;
  }

  public static readonly ItemMessage = ItemMessage;

  public static readonly ExperienceMessage = ExperienceMessage;

  public static readonly MasterDeathMessage = MasterDeathMessage;

  public static readonly MasterLevelMessage = MasterLevelMessage;

  public static isItemMessage = (message: InformationMessage): message is ItemMessage => {
    return message.variant === FisherMessageVariant.Item;
  };

  public static isExperienceMessage = (message: InformationMessage): message is ExperienceMessage => {
    return message.variant === FisherMessageVariant.Experience;
  };

  public static isMasterDeathMessage = (message: InformationMessage): message is MasterDeathMessage => {
    return message.variant === FisherMessageVariant.MasterDeath;
  };

  public static isMasterLevelMessage = (message: InformationMessage): message is MasterLevelMessage => {
    return message.variant === FisherMessageVariant.MasterLevel;
  };

  public event = new EventEmitter();

  public alert = (messages: InformationMessage[]) => {
    this.event.emit(Information.InformationEventKeys.AlertMessage, messages);
  };

  public tip = (messages: InformationMessage[]) => {
    this.event.emit(Information.InformationEventKeys.TipMessage, messages);
  };
}

const information = Information.create();

export { Information, information };
