import { IPersonLevelUpRequirements } from './FisherPersonLevel';
import personLevelDataJson from './PersonLevelData.json';
import {
  BaseLevelUpBattleTimes,
  IPersonLevelUpMethods,
  PersonLevel,
} from './Constants';

interface PersonLevelData {
  state: string;
  label: string;
  coefficient: number;
  nextLevel: PersonLevel;
  levelUpRequirementTasks?: string[];
}

/**
 * 返回找到的人物境界数据
 *
 * @export
 * @param {PersonLevel} personLevel
 * @return {*}  {PersonLevelData}
 */
export function findPersonLevelData(personLevel: PersonLevel): PersonLevelData {
  const { data } = personLevelDataJson;
  return data[personLevel] as PersonLevelData;
}

/**
 * 升级需要的条件
 * - battleTimes 战斗胜利次数
 * - tasks 任务
 *
 * @interface  IPersonLevelUpRequirements
 */

type IFisherInitializedPersonLevelData = {
  levelUpRequirements: IPersonLevelUpRequirements;
} & PersonLevelData;

/**
 * 初始化人物等级数据
 *
 * @export
 * @param {PersonLevel} personLevel
 * @return {*}  {IFisherInitializedPersonLevelData}
 */
export function initializePersonLevelData(
  personLevel: PersonLevel
): IFisherInitializedPersonLevelData {
  const { state, label, coefficient, nextLevel, levelUpRequirementTasks } =
    findPersonLevelData(personLevel);
  return {
    state,
    label,
    nextLevel,
    coefficient,
    levelUpRequirements: {
      tasks: levelUpRequirementTasks ?? [],
      battleTimes: coefficient * BaseLevelUpBattleTimes,
    },
  };
}

export function isAutoPersonLevelUp(
  levelUpMethod: IPersonLevelUpMethods
): levelUpMethod is IPersonLevelUpMethods.Auto {
  return levelUpMethod === IPersonLevelUpMethods.Auto;
}

export function isManualPersonLevelUp(
  levelUpMethod: IPersonLevelUpMethods
): levelUpMethod is IPersonLevelUpMethods.Manual {
  return levelUpMethod === IPersonLevelUpMethods.Manual;
}
