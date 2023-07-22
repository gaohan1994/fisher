import { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Recipe } from '@FisherCore';
import { useCook, useForge } from '../../../core';

interface WrappedComponentBaseProps {
  recipe: Recipe;
}
export function injectForgeRecipePropsHoc<T extends WrappedComponentBaseProps>(Comp: FC<T>) {
  const ComponentWithRecipeInfo: FC<T> = (props: T) => {
    const component = useForge();
    const { recipe } = props;
    const { activeRecipe, setActiveRecipe } = component;
    const active = Boolean(activeRecipe?.id === recipe.id);

    const onClick = useCallback(() => {
      setActiveRecipe(recipe);
    }, [recipe]);

    return <Comp {...props} active={active} onClick={onClick} />;
  };

  return observer(ComponentWithRecipeInfo);
}

export function injectCookRecipePropsHoc<T extends WrappedComponentBaseProps>(Comp: FC<T>) {
  const ComponentWithRecipeInfo: FC<T> = (props: T) => {
    const component = useCook();
    const { recipe } = props;
    const { activeRecipe, setActiveRecipe } = component;
    const active = Boolean(activeRecipe?.id === recipe.id);

    const onClick = useCallback(() => {
      setActiveRecipe(recipe);
    }, [recipe]);

    return <Comp {...props} active={active} onClick={onClick} />;
  };

  return observer(ComponentWithRecipeInfo);
}
