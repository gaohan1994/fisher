import { FC } from 'react';
import { StationProps } from '../Station';
import { EmptyStation } from './EmptyStation';

export function useStationHoc(Comp: FC<StationProps>) {
  return function wrappedEmptyStationHocComponent(props: StationProps) {
    const {
      component: {
        skill: {
          recipeHandler: { activeRecipe },
        },
      },
    } = props;

    if (activeRecipe === undefined) {
      return <EmptyStation />;
    }

    return <Comp {...props} />;
  };
}
