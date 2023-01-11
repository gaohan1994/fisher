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
  }

  export enum Reward {
    RewardGold = 'RewardGold',
    RewardItem = 'RewardItem',
    RewardExperience = 'RewardExperience',
  }
}

export { events, EventKeys };
