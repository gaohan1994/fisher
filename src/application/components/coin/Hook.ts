import numeral from 'numeral';

/**
 * Return format coin value
 * @param coin
 * @returns
 */
export const useCoinValue = (coin: number) => {
  return numeral(Number(coin)).format('0,0');
};
