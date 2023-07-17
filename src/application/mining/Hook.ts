import { useMining } from '../core';

/**
 * Return all mining package recipes
 * @returns
 */
export const useRecipes = () => {
  const {
    packages: { recipes },
  } = useMining();
  return recipes;
};
