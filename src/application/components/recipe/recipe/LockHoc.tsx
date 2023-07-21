import { FC } from 'react';

import { useRecipeIsLocked } from './Hooks';
import { RecipeCardProps } from './RecipeCard';
import { LockRecipeCard } from './LockRecipeCard';

export function useLevelLockHoc<T extends RecipeCardProps>(Comp: FC<T>) {
  return function LockWrappedComp(props: RecipeCardProps) {
    const {
      component: { level },
      recipe,
    } = props;

    const isLocked = useRecipeIsLocked(recipe, level);
    if (isLocked) {
      return <LockRecipeCard recipe={recipe} />;
    }

    return <Comp {...(props as T)} />;
  };
}
