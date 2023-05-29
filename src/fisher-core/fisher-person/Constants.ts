import { FisherPersonError } from '../fisher-error';

enum PersonMode {
  Master = 'Master',
  CommonEnemy = 'CommonEnemy',
  EliteEnemy = 'EliteEnemy',
  LegendaryEnemy = 'LegendaryEnemy',
}

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
  DefencePowerFactor: 0.5,
};

const CommonEnemyConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2500,
  InitializeMaxHp: 500,
  HpFactor: 20,
  AttackPowerFactor: 2,
  DefencePowerFactor: 0.5,
};

const EliteEnemyConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2000,
  InitializeMaxHp: 5000,
  HpFactor: 20,
  AttackPowerFactor: 3,
  DefencePowerFactor: 1,
};

const LegendaryEnemyConfig: PersonFactorConfig = {
  DefenceFormulaFactor: 0.06,
  DefaultAttackSpeed: 2000,
  InitializeMaxHp: 20000,
  HpFactor: 50,
  AttackPowerFactor: 4,
  DefencePowerFactor: 3,
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

export { PersonMode, getPersonFactorConfig };
export type { PersonFactorConfig };
