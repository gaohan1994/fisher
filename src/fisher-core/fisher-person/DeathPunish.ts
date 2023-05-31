import { makeAutoObservable } from 'mobx';
import { Bank } from '../fisher-bank';
import { Person } from './Person';
import { EventKeys, events } from '../fisher-events';

const DeathPunishConfig = {
  componentId: 'Master',
  experiencePunishProtectionLevel: 20,
  experiencePunishPercent: 0.1,
  goldPunishPercent: 0.1,
};

class DeathPunish {
  private goldPunish = 0;

  private experiencePunish = 0;

  constructor(person: Person) {
    makeAutoObservable(this);

    this.goldPunish = Math.max(0, Bank.create().gold * DeathPunishConfig.goldPunishPercent);

    if (person.experience.level > DeathPunishConfig.experiencePunishProtectionLevel) {
      this.experiencePunish = person.experience.experience * DeathPunishConfig.experiencePunishPercent;
    }
  }

  public executePunish = () => {
    this.executeGoldPunish();
    this.executeExperiencePunish();
  };

  private executeGoldPunish = () => {
    events.emit(EventKeys.Bank.ReceiveGold, -this.goldPunish);
  };

  private executeExperiencePunish = () => {
    if (this.experiencePunish > 0) {
      events.emit(EventKeys.Reward.RewardExperience, DeathPunishConfig.componentId, this.experiencePunish);
    }
  };
}

export { DeathPunish };
