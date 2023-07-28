import { ComponentWithExperience } from '../fisher-core';
import { Item } from '../fisher-item';
import { FisherInformationError } from '@shared';
import { FisherMessageVariant } from './Constants';

let messageId = 1;
abstract class FisherInformationMessage<MessageDetail> {
  abstract variant: FisherMessageVariant;

  abstract message: MessageDetail;

  public key: string;

  constructor() {
    this.key = `${++messageId}${new Date().getTime()}`;
  }
}

interface ItemMessageDetail {
  item: Item;
  quantity: number;
  prefix: string;
}

class ItemMessage extends FisherInformationMessage<ItemMessageDetail> {
  public variant = FisherMessageVariant.Item;

  public message: ItemMessageDetail;

  constructor(item: Item, quantity: number) {
    super();

    this.message = {
      prefix: '您',
      item,
      quantity,
    };
  }
}

interface ExperienceMessageDetail {
  prefix: string;
  experience: number;
  componentId: string;
  component: ComponentWithExperience;
}
class ExperienceMessage extends FisherInformationMessage<ExperienceMessageDetail> {
  public variant = FisherMessageVariant.Experience;

  public message: ExperienceMessageDetail;

  constructor(component: ComponentWithExperience, experience: number) {
    super();
    if (component === undefined) {
      throw new FisherInformationError('Can not find component', '没有找到组件');
    }

    this.message = {
      experience,
      prefix: component.id === 'Master' ? '您' : component.name,
      componentId: component.id,
      component,
    };
  }
}

interface MasterDeathMessageDetail {
  prefix: string;
}
class MasterDeathMessage extends FisherInformationMessage<MasterDeathMessageDetail> {
  public variant = FisherMessageVariant.MasterDeath;

  public message: MasterDeathMessageDetail;

  constructor() {
    super();
    this.message = { prefix: '您' };
  }
}

interface MasterLevelMessageDetail {
  prefix: string;
  beforeLevel: number;
  level: number;
}
class MasterLevelMessage extends FisherInformationMessage<MasterLevelMessageDetail> {
  public variant = FisherMessageVariant.MasterLevel;

  public message: MasterLevelMessageDetail;

  constructor(beforeLevel: number, level: number) {
    super();
    this.message = { prefix: '您', beforeLevel, level };
  }
}

interface NormalMessageDetail {
  message: string;
  color?: any;
}

class NormalMessage extends FisherInformationMessage<NormalMessageDetail> {
  public variant = FisherMessageVariant.Normal;

  public message: NormalMessageDetail;

  constructor(message: string, color?: any) {
    super();
    this.message = {
      message,
      color,
    };
  }
}

type InformationMessage = ItemMessage | ExperienceMessage | MasterDeathMessage | MasterLevelMessage | NormalMessage;

export {
  FisherInformationMessage,
  ItemMessage,
  ExperienceMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
};
export type { InformationMessage };
