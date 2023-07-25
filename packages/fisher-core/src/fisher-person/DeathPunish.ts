import { makeAutoObservable } from 'mobx';
import { EventKeys, events } from '../fisher-events';
import { Information, informationAlert } from '../fisher-information';
import { random } from '../utils';
import { Person } from './Person';

const DeathPunishComponentId = 'Master';
const DeathExperienceProtectionLevel = 20;
const DeathExperiencePunishPercent = 0.1;
const DeathGoldPunishLevelCoe = 10;

class DeathPunish {
  private goldPunish: number;

  private experiencePunish: number;

  /**
   * Creates an instance of DeathPunish.
   * generate gold punish and experience punish.
   *
   * @author Harper.Gao
   * @param {Person} person
   * @memberof DeathPunish
   */
  constructor(person: Person) {
    makeAutoObservable(this);

    this.goldPunish = this.createGoldPunish(person);
    this.experiencePunish = this.createExperiencePunish(person);
  }

  /**
   * Execute person punish
   *
   * @author Harper.Gao
   * @memberof DeathPunish
   */
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
      events.emit(EventKeys.Reward.RewardExperience, DeathPunishComponentId, -this.experiencePunish, true);
    }
  };

  /**
   * Return the gold punish that master will lost
   *
   * @author Harper.Gao
   * @private
   * @memberof DeathPunish
   */
  private createGoldPunish = (person: Person): number => {
    return Math.max(0, person.experience.level * DeathGoldPunishLevelCoe * random(1, 10));
  };

  /**
   * Return the experience that master will lost
   *
   * @author Harper.Gao
   * @private
   * @param {Person} person
   * @memberof DeathPunish
   */
  private createExperiencePunish = (person: Person): number => {
    if (person.experience.level < DeathExperienceProtectionLevel) return 0;
    return Math.round(person.experience.experience * DeathExperiencePunishPercent);
  };
}

export { DeathPunish };
