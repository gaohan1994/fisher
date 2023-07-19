import { observer } from 'mobx-react';
import { RecipeCard as UnWrappedRecipeCard, RecipeCardProps } from './RecipeCard';
import { useLevelLockHoc } from './LockHoc';

const RecipeCard = observer(useLevelLockHoc(UnWrappedRecipeCard));

export { RecipeCard };
export type { RecipeCardProps };
