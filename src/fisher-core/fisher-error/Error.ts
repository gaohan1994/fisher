enum FisherErrorCode {
  Fight = 10007,
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

export { FisherError, FisherFightError };
