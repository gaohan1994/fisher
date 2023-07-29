import { EventEmitter } from 'smar-util';
import {
  ExperienceMessage,
  InformationMessage,
  ItemMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
} from './Message.js';
import { FisherMessageVariant } from './Constants.js';

enum InformationEventKeys {
  TipMessage = 'TipMessage',
  AlertMessage = 'AlertMessage',
  Loading = 'Loading',
}

enum InformationColor {
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
}

class Information {
  public static instance: Information;

  public static readonly InformationEventKeys = InformationEventKeys;

  public static readonly InformationColor = InformationColor;

  public id = 'Information';

  public name = '消息';

  public media = '';

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

  public static readonly NormalMessage = NormalMessage;

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

  public static isNormalMessage = (message: InformationMessage): message is NormalMessage => {
    return message.variant === FisherMessageVariant.Normal;
  };

  public event = new EventEmitter();

  public alert = (messages: InformationMessage[]) => {
    this.event.emit(Information.InformationEventKeys.AlertMessage, messages);
  };

  public tip = (messages: InformationMessage[]) => {
    this.event.emit(Information.InformationEventKeys.TipMessage, messages);
  };

  public loading = (loading: boolean, messages?: InformationMessage[]) => {
    this.event.emit(Information.InformationEventKeys.Loading, loading, messages);
  };
}

const information = Information.create();

export { Information, information };
