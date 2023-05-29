import { makeAutoObservable } from 'mobx';
import { EnemyItemReward, EnemyRandomReward, EnemyItem } from '../fisher-item';
import { Reward } from '../fisher-reward';
import { generateTimestamp } from '../utils';
import { PersonMode } from './Constants';
import { Person } from './Person';

class Enemy {
  public key: number;

  public id: string;

  public name: string;

  public media: string;

  public person: Person;

  public get Hp() {
    return this.person.Hp;
  }

  public get attributePanel() {
    return this.person.attributePanel;
  }

  public get actionManager() {
    return this.person.actionManager;
  }

  public get personEquipmentManager() {
    return this.person.personEquipmentManager;
  }

  public goldReward = 0;

  public get hasGoldReward() {
    return typeof this.goldReward === 'number' && this.goldReward >= 0;
  }

  public itemRewards: EnemyItemReward[] = [];

  public get hasItemRewards() {
    return this.itemRewards && this.itemRewards.length > 0;
  }

  public randomRewards: EnemyRandomReward[] = [];

  public get hasRandomRewards() {
    return this.randomRewards && this.randomRewards.length > 0;
  }

  constructor({ id, mode, media, name, goldReward, itemRewards, randomRewards }: EnemyItem) {
    makeAutoObservable(this);

    this.key = generateTimestamp();

    this.id = id;

    this.name = name;

    this.media = media;

    this.person = new Person(mode as PersonMode);

    if (goldReward) {
      this.goldReward = goldReward;
    }

    if (itemRewards) {
      this.itemRewards = itemRewards;
    }

    if (randomRewards) {
      this.randomRewards = randomRewards;
    }
  }

  /**
   * 生成金钱奖励
   * 生成物品奖励
   * 生成随机金钱 / 物品奖励
   *
   * @memberof Enemy
   */
  public provideRewards = (): Reward[] => {
    const result: Reward[] = [];
    if (this.hasGoldReward) {
      result.push(this.createGoldReward());
    }

    if (this.hasItemRewards) {
      result.push(...this.createItemRewards());
    }

    if (this.hasRandomRewards) {
      result.push(...this.createRandomRewards());
    }

    Person.logger.debug(`Provide Enemy:${this.id} rewards`);
    return result;
  };

  private createGoldReward = () => {
    return Reward.create({ gold: this.goldReward });
  };

  private createRandomRewards = () => {
    return this.randomRewards
      .map(({ probability, gold, itemId, itemQuantity }) =>
        Reward.createRandomReward(probability, {
          gold,
          itemId,
          itemQuantity,
        })
      )
      .filter(Boolean) as Reward[];
  };

  private createItemRewards = () => {
    return this.itemRewards.map(Reward.create);
  };

  public setTarget = (person: Person) => {
    this.person.setTarget(person);
  };

  public startBattle = () => {
    this.person.startBattle();
  };

  public stopBattle = () => {
    this.person.stopBattle();
  };
}

export { Enemy };
