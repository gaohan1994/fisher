import { EventEmitter } from 'smar-util';

const events = new EventEmitter();

namespace EventKeys {
  export enum Core {
    SetActiveComponent = 'SetActiveComponent',
    MasterDeath = 'MasterDeath',
    EnemyDeath = 'EnemyDeath',
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
    RewardExperience = 'RewardExperience',
  }

  export enum Update {
    BackpackUpdate = 'BackpackUpdate',
    BankUpdate = 'BankUpdate',
  }

  export enum Archive {
    SaveFullArchive = 'SaveFullArchive',
    LoadArchive = 'LoadArchive',
    ExitArchive = 'ExitArchive',
  }
}

export { events, EventKeys };
