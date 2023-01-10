import { EventEmitter } from 'smar-util';

const events = new EventEmitter();

namespace EventKeys {
  export enum Reward {
    RewardGold = 'RewardGold',
    RewardItem = 'RewardItem',
    RewardExperience = 'RewardExperience',
  }
}

export { events, EventKeys };
