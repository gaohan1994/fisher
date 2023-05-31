import { makeAutoObservable } from 'mobx';
import { ExperienceMessage, InformationMessage, ItemMessage, MasterDeathMessage, MasterLevelMessage } from './Message';
import { FisherInformationMessageHandler } from './MessageHandler';
import { FisherInformationVariant, FisherMessageVariant } from './Constants';
import { FisherInformationError } from '../fisher-error';

type MessageHandlerId = number;

let messageHandlerId: MessageHandlerId = 1;

class Information {
  public static instance: Information;

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

  public messageHandlerMap = new Map<MessageHandlerId, FisherInformationMessageHandler>();

  public get alertMessageHandlers() {
    let result: FisherInformationMessageHandler[] = [];
    this.messageHandlerMap.forEach((handler) => {
      if (handler.isAlertVariant) {
        result.push(handler);
      }
    });

    return result;
  }

  public get tipMessageHandlers() {
    let result: FisherInformationMessageHandler[] = [];
    this.messageHandlerMap.forEach((handler) => {
      if (handler.isTipVariant) {
        result.push(handler);
      }
    });

    return result;
  }

  private constructor() {
    makeAutoObservable(this);
  }

  public alert = (messages: InformationMessage[]): MessageHandlerId => {
    const id = ++messageHandlerId;
    this.messageHandlerMap.set(id, new FisherInformationMessageHandler(id, FisherInformationVariant.Alert, messages));

    return id;
  };

  public tip = (messages: InformationMessage[]): MessageHandlerId => {
    const id = ++messageHandlerId;
    this.messageHandlerMap.set(id, new FisherInformationMessageHandler(id, FisherInformationVariant.Tip, messages));

    return id;
  };

  public closeMessage = (id: MessageHandlerId) => {
    const messageHandler = this.messageHandlerMap.get(id);
    if (messageHandler === undefined) {
      throw new FisherInformationError(`Try close a undefined message handler`, '没有找到该消息');
    }

    this.messageHandlerMap.delete(id);
  };
}

const information = Information.create();
export { Information };
