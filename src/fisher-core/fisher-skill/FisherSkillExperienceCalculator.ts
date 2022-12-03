import { makeAutoObservable } from 'mobx';

export interface IFisherSkillExperienceCalculator {
  experience?: number;
}

/**
 * 增加经验
 *
 * @interface IFisherSkillExperienceCalculatorAddExperience
 * @template This
 */
interface IFisherSkillExperienceCalculatorAddExperience<This> {
  (value: number): This;
}

/**
 * 设置经验值
 */
type IFisherSkillExperienceCalculatorSetExperience<This> =
  IFisherSkillExperienceCalculatorAddExperience<This>;

/**
 * 技能经验值计算器
 * - 传入经验值
 * - 计算经验值对应的等级
 * - 当经验值变化的时候计算变化之后的经验值
 *
 * @export
 * @class FisherSkillExperienceCalculator
 */
export class FisherSkillExperienceCalculator {
  public experience: number;
  constructor({ experience }: IFisherSkillExperienceCalculator) {
    makeAutoObservable(this);
    this.experience = experience ?? 0;
  }

  public get level() {
    return 1;
  }

  public addExperience: IFisherSkillExperienceCalculatorAddExperience<this> = (
    value: number
  ): this => {
    this.experience += value;
    return this;
  };

  public setExperience: IFisherSkillExperienceCalculatorSetExperience<this> = (
    value: number
  ): this => {
    this.experience = value;
    return this;
  };
}
