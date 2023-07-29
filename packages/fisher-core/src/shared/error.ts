import { prefixLogger, prefixes } from '@fisher/logger';

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

export class FisherFightError extends FisherError {
  code = FisherError.FisherErrorCode.Fight;
}

export class FisherBattleError extends FisherError {
  code = FisherError.FisherErrorCode.Battle;
}

export class FisherDungeonError extends FisherError {
  code = FisherError.FisherErrorCode.Dungeon;
}

export class FisherActionError extends FisherError {
  code = FisherError.FisherErrorCode.Action;
}

export class FisherPersonError extends FisherError {
  code = FisherError.FisherErrorCode.Person;
}

export class FisherSkillError extends FisherError {
  code = FisherError.FisherErrorCode.Skill;
}

export class FisherInformationError extends FisherError {
  code = FisherError.FisherErrorCode.Information;
}

export class FisherBackpackError extends FisherError {
  code = FisherError.FisherErrorCode.Backpack;
}

export class FisherCoreError extends FisherError {
  code = FisherError.FisherErrorCode.Core;
}
