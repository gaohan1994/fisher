import { Person } from '@person';
import { BaseAttackAction } from './BaseAction';
import { ActionId } from './Constants';

class NormalAttackAction extends BaseAttackAction {
  public readonly id = ActionId.NormalAttackAction;

  public readonly name = '普通攻击';

  public readonly desc = '普通攻击';

  public chance = 100;

  public execute = (person: Person) => {
    if (!person.target) {
      return BaseAttackAction.logger.error(`Try to execute ${this.id} but target was undefined`);
    }

    person.target.hurtRange(person.attributePanel.AttackDamage);
  };
}

class CritAttackAction extends BaseAttackAction {
  public static readonly CritAttackMultiplier = 2;

  public readonly chance = 20;

  public readonly id = ActionId.CritAttackAction;

  public readonly name = '暴击';

  public readonly desc = '造成2倍伤害的物理致命一击';

  public execute = (person: Person) => {
    if (!person.target) {
      return BaseAttackAction.logger.error(`Try to execute ${this.id} but target was undefined`);
    }

    person.target.hurtRange(CritAttackAction.CritAttackMultiplier * person.attributePanel.AttackDamage);
  };
}

class LowFixedDamageAction extends BaseAttackAction {
  public static readonly LowFixedDamageActionMultiplier = 2;

  public readonly id = ActionId.LowFixedDamageAction;

  public readonly chance = 20;

  public readonly name = '固伤攻击（低级）';

  public readonly desc = '根据自身等级对目标造成伤害';

  public execute = (person: Person) => {
    if (!person.target) {
      return BaseAttackAction.logger.error(`Try to execute ${this.id} but target was undefined`);
    }

    person.target.hurt(
      person.experience.level * LowFixedDamageAction.LowFixedDamageActionMultiplier + person.attributePanel.AttackDamage
    );
  };
}

class HighFixedDamageAction extends BaseAttackAction {
  public static readonly HighFixedDamageActionMultiplier = 3;

  public readonly id = ActionId.HighFixedDamageAction;

  public readonly chance = 10;

  public readonly name = '固伤攻击（高级）';

  public readonly desc = '根据自身等级对目标造成较高伤害';

  public execute = (person: Person) => {
    if (!person.target) {
      return BaseAttackAction.logger.error(`Try to execute ${this.id} but target was undefined`);
    }

    person.target.hurt(
      person.experience.level * HighFixedDamageAction.HighFixedDamageActionMultiplier +
        person.attributePanel.AttackDamage
    );
  };
}

class LowBatterAction extends BaseAttackAction {
  public static readonly LowBatterActionDamangeMultiplier = 0.75;
  public static readonly LowBatterActionAttackFrequency = 2;

  public readonly id = ActionId.LowBatterAction;

  public readonly chance = 10;

  public readonly name = '二次连击';

  public readonly desc = '降低单次伤害，连续发动2次攻击';

  public execute = (person: Person) => {
    if (!person.target) {
      return BaseAttackAction.logger.error(`Try to execute ${this.id} but target was undefined`);
    }

    for (let index = 0; index < LowBatterAction.LowBatterActionAttackFrequency; index++) {
      person.target.hurtRange(person.attributePanel.AttackDamage * LowBatterAction.LowBatterActionDamangeMultiplier);
    }
  };
}

class HighBatterAction extends BaseAttackAction {
  public static readonly HighBatterActionDamangeMultiplier = 0.6;
  public static readonly HighBatterActionAttackFrequency = 3;
  public static readonly HighBatterActionEffectHpMultiplier = 0.1;

  public readonly id = ActionId.HighBatterAction;

  public readonly chance = 10;

  public readonly name = '三刺';

  public readonly desc = '降低单次伤害，连续发动3次攻击，使用后自身扣除少量血量';

  public execute = (person: Person) => {
    if (!person.target) {
      return BaseAttackAction.logger.error(`Try to execute ${this.id} but target was undefined`);
    }

    for (let index = 0; index < HighBatterAction.HighBatterActionAttackFrequency; index++) {
      person.target.hurtRange(person.attributePanel.AttackDamage * HighBatterAction.HighBatterActionDamangeMultiplier);
    }

    this.effect(person);
  };

  private effect = (person: Person) => {
    person.hurt(person.attributePanel.BaseMaxHp * HighBatterAction.HighBatterActionEffectHpMultiplier);
  };
}

export {
  NormalAttackAction,
  CritAttackAction,
  LowFixedDamageAction,
  HighFixedDamageAction,
  LowBatterAction,
  HighBatterAction,
};
