import { core } from '../fisher-core';
import { Item } from '../fisher-item';
import { FisherInformationError } from '../fisher-error';
import { FisherMessageVariant } from './Constants';

abstract class FisherInformationMessage<MessageDetail> {
  abstract variant: FisherMessageVariant;

  abstract message: MessageDetail;
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
}
class ExperienceMessage extends FisherInformationMessage<ExperienceMessageDetail> {
  public variant = FisherMessageVariant.Experience;

  public message: ExperienceMessageDetail;

  constructor(componentId: string, experience: number) {
    super();
    const component = core.componentManager.componentMap.get(componentId);
    if (component === undefined) {
      throw new FisherInformationError(`Can not find a component id: ${componentId}`, '没有找到组件');
    }

    this.message = {
      experience,
      prefix: component.name,
      componentId: componentId,
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
  public variant = FisherMessageVariant.MasterDeath;

  public message: MasterLevelMessageDetail;

  constructor(beforeLevel: number, level: number) {
    super();
    this.message = { prefix: '您', beforeLevel, level };
  }
}

type InformationMessage = ItemMessage | ExperienceMessage | MasterDeathMessage | MasterLevelMessage;

export { FisherInformationMessage, ItemMessage, ExperienceMessage, MasterDeathMessage, MasterLevelMessage };
export type { InformationMessage };
