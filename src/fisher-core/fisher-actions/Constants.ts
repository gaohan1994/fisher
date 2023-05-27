enum ActionMode {
  Attack = 'Attack',
  Dot = 'Dot',
  Heal = 'Heal',
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

  /**
   * Heal actions constants
   */
  LowHealAction = 'LowHealAction',
  HighHealAction = 'HighHealAction',
}

export { ActionMode, ActionId };
