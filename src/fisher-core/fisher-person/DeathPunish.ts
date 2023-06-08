import { makeAutoObservable } from 'mobx';
import { Person } from './Person';
import { EventKeys, events } from '../fisher-events';
import { core } from '../fisher-core';
import { Information, informationAlert } from '../fisher-information';

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

    this.goldPunish = Math.max(0, Math.round(core.bank.gold * DeathPunishConfig.goldPunishPercent));

    if (person.experience.level > DeathPunishConfig.experiencePunishProtectionLevel) {
      this.experiencePunish = Math.round(person.experience.experience * DeathPunishConfig.experiencePunishPercent);
    }
  }

  public executePunish = () => {
    informationAlert([new Information.NormalMessage('您死了', 'error')]);
    this.executeGoldPunish();
    this.executeExperiencePunish();
  };

  private executeGoldPunish = () => {
    events.emit(EventKeys.Bank.ReceiveGold, -this.goldPunish, true);
  };

  private executeExperiencePunish = () => {
    if (this.experiencePunish > 0) {
      events.emit(EventKeys.Reward.RewardExperience, DeathPunishConfig.componentId, -this.experiencePunish, true);
    }
  };
}

export { DeathPunish };
