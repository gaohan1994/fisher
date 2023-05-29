enum FisherErrorCode {
  Person = 9000,
  Action = 10006,
  Fight = 10007,
  Battle = 10008,
  Dungeon = 10009,
}

abstract class FisherError extends Error {
  public static readonly FisherErrorCode = FisherErrorCode;

  public abstract code: FisherErrorCode;

  public label: string | number = '未知的错误详情';

  constructor(message: string, label?: string | number) {
    super(message);

    if (label !== undefined) {
      this.label = label;
    }
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

export { FisherError, FisherPersonError, FisherFightError, FisherBattleError, FisherDungeonError, FisherActionError };
