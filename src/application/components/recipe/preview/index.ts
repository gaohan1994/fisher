import { injectCookRecipePropsHoc, injectForgeRecipePropsHoc } from './Hoc';
import { Preview } from './Preview';

export const ForgePreview = injectForgeRecipePropsHoc(Preview);

export const CookPreview = injectCookRecipePropsHoc(Preview);
