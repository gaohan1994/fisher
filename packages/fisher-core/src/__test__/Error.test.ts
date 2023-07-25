import { describe, expect, test } from 'vitest';
import { FisherError } from '../fisher-error';

describe('FisherError', () => {
  test('should throw a fisher error', () => {
    class FisherFightError extends FisherError {
      code = FisherError.FisherErrorCode.Fight;
    }

    const error = new FisherFightError('fight error message', '错误详情');
    expect(error.code).toEqual(FisherError.FisherErrorCode.Fight);
    expect(error.message).toEqual('fight error message');
    expect(error.label).toEqual('错误详情');

    expect(() => {
      throw error;
    }).toThrowError(/^fight error message$/);
  });
});
