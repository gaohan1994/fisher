enum ActionMode {
  Attack = 'Attack',
  Dot = 'Dot',
  Heal = 'Heal',
  Buff = 'Buff',
  Debuff = 'Debuff',
}

enum ActionId {
  /**
   * Attack actions constants
   */
  NormalAttackAction = 'NormalAttackAction',
  CritAttackAction = 'CritAttackAction',
  LowFixedDamageAction = 'LowFixedDamageAction',
  HighFixedDamageAction = 'HighFixedDamageAction',
  LowBatterAction = 'LowBatterAction',
  HighBatterAction = 'HighBatterAction',

  /**
   * Dot actions constants
   */
  PosionDotAction = 'PosionDotAction',
  DragonSwordAction = 'DragonSwordAction',

  /**
   * Heal actions constants
   */
  LowHealAction = 'LowHealAction',
  HighHealAction = 'HighHealAction',

  /**
   * Buff actions constants
   */
  LowBuffAttackPowerAction = 'LowBuffAttackPowerAction',
  LowBuffAttackPowerMultiplierAction = 'LowBuffAttackPowerMultiplierAction',
  LowBuffDefencePowerAction = 'LowBuffDefencePowerAction',
  LowBuffDefencePowerMultiplierAction = 'LowBuffDefencePowerMultiplierAction',
  LowBuffDefenceCorruptionAction = 'LowBuffDefenceCorruptionAction',

  /**
   * Debuff actions constants
   */
  LowDebuffAttackPowerAction = 'LowDebuffAttackPowerAction',
}

export { ActionMode, ActionId };
