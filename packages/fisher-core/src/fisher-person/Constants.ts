import { FisherPersonError } from '../fisher-error';

enum PersonMode {
  Master = 'Master',
  CommonEnemy = 'CommonEnemy',
  EliteEnemy = 'EliteEnemy',
  LegendaryEnemy = 'LegendaryEnemy',
}

const PersonModeName = {
  [PersonMode.Master]: '玩家',
  [PersonMode.CommonEnemy]: '普通',
  [PersonMode.EliteEnemy]: '精英',
  [PersonMode.LegendaryEnemy]: '传说',
};

interface PersonFactorConfig {
  DefenceFormulaFactor: number;
  DefaultAttackSpeed: number;
  InitializeMaxHp: number;
  HpFactor: number;
  AttackPowerFactor: number;
  DefencePowerFactor: number;
}

const MasterModeConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2500,
  InitializeMaxHp: 500,
  HpFactor: 20,
  AttackPowerFactor: 2,
  DefencePowerFactor: 0.1,
};

const CommonEnemyConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2500,
  InitializeMaxHp: 500,
  HpFactor: 20,
  AttackPowerFactor: 2,
  DefencePowerFactor: 0.1,
};

const EliteEnemyConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2000,
  InitializeMaxHp: 1000,
  HpFactor: 20,
  AttackPowerFactor: 3,
  DefencePowerFactor: 0.1,
};

const LegendaryEnemyConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2000,
  InitializeMaxHp: 15000,
  HpFactor: 50,
  AttackPowerFactor: 4,
  DefencePowerFactor: 0.4,
};

const getPersonFactorConfig = (mode: PersonMode) => {
  if (mode === PersonMode.Master) {
    return MasterModeConfig;
  }

  if (mode === PersonMode.CommonEnemy) {
    return CommonEnemyConfig;
  }

  if (mode === PersonMode.EliteEnemy) {
    return EliteEnemyConfig;
  }

  if (mode === PersonMode.LegendaryEnemy) {
    return LegendaryEnemyConfig;
  }

  throw new FisherPersonError('Wrong person mode');
};

export { PersonModeName, PersonMode, getPersonFactorConfig };
export type { PersonFactorConfig };
