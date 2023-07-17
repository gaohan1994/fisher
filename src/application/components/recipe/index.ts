import { useLevelLockHoc } from './LockHoc';
import { RecipeCard as UnWrappedRecipeCard } from './RecipeCard';

const RecipeCard = useLevelLockHoc(UnWrappedRecipeCard);

export { RecipeCard };
