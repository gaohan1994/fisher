import { prefixLogger, prefixes } from '@FisherLogger';

enum FisherErrorCode {
  Core = 1000,
  Backpack = 6000,
  Information = 7000,
  Skill = 8000,
  Person = 9000,
  Action = 10006,
  Fight = 10007,
  Battle = 10008,
  Dungeon = 10009,
}

abstract class FisherError extends Error {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'FisherError');

  public static readonly FisherErrorCode = FisherErrorCode;

  public abstract code: FisherErrorCode;

  public label: string | number = '未知的错误详情';

  constructor(message: string, label?: string | number) {
    super(message);

    if (label !== undefined) {
      this.label = label;
    }

    FisherError.logger.error(`Error message: ${message}`, `Error label: ${label}`);
  }
}

class FisherFightError extends FisherError {
  code = FisherError.FisherErrorCode.Fight;
}

class FisherBattleError extends FisherError {
  code = FisherError.FisherErrorCode.Battle;
}

class FisherDungeonError extends FisherError {
  code = FisherError.FisherErrorCode.Dungeon;
}

class FisherActionError extends FisherError {
  code = FisherError.FisherErrorCode.Action;
}

class FisherPersonError extends FisherError {
  code = FisherError.FisherErrorCode.Person;
}

class FisherSkillError extends FisherError {
  code = FisherError.FisherErrorCode.Skill;
}

class FisherInformationError extends FisherError {
  code = FisherError.FisherErrorCode.Information;
}

class FisherBackpackError extends FisherError {
  code = FisherError.FisherErrorCode.Backpack;
}

class FisherCoreError extends FisherError {
  code = FisherError.FisherErrorCode.Core;
}

export {
  FisherError,
  FisherPersonError,
  FisherFightError,
  FisherBattleError,
  FisherDungeonError,
  FisherActionError,
  FisherSkillError,
  FisherInformationError,
  FisherBackpackError,
  FisherCoreError,
};
