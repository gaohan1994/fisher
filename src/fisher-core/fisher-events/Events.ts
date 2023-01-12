import { EventEmitter } from 'smar-util';

const events = new EventEmitter();

namespace EventKeys {
  export enum Core {
    SetActiveComponent = 'SetActiveComponent',
  }

  export enum Bank {
    ReceiveGold = 'ReceiveGold',
  }

  export enum Backpack {
    AddItem = 'AddItem',
    ReduceItem = 'ReduceItem',
    SellItem = 'SellItem',
    BackpackUpdated = 'BackpackUpdated',
  }

  export enum Reward {
    RewardExperience = 'RewardExperience',
  }
}

export { events, EventKeys };
