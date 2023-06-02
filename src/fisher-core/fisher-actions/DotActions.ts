import { BaseDotAction } from './BaseAction';
import { ActionId } from './Constants';

class PosionDotAction extends BaseDotAction {
  public override readonly id = ActionId.PosionDotAction;

  public readonly name = '剧毒';

  public readonly chance = 30;

  public readonly totalEffectiveTimes = 5;

  public readonly desc = '对目标造成持续毒攻击';

  public effectiveTimes = 0;

  public get interval() {
    return 1000;
  }

  public damage = () => {
    return this.person!.attributePanel.AttackDamage / 4 + this.person!.experience.level;
  };
}

class DragonSwordAction extends BaseDotAction {
  public static readonly Interval = 500;

  public override readonly id = ActionId.DragonSwordAction;

  public readonly chance = 30;

  public readonly totalEffectiveTimes = 3;

  public readonly name = '斩龙剑气';

  public readonly desc = '有概率发动斩龙剑气，对目标持续造成伤害';

  public effectiveTimes = 0;

  public get interval() {
    return DragonSwordAction.Interval;
  }

  public damage = () => {
    return this.person?.attributePanel.AttackDamage!;
  };
}
export { PosionDotAction, DragonSwordAction };
