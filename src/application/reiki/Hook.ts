import { useReiki } from '../core';

/**
 * Return all reiki package recipes
 * @returns
 */
export const useRecipes = () => {
  const {
    packages: { recipes },
  } = useReiki();
  return recipes;
};
