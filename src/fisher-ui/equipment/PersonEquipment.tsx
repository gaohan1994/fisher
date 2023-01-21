import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { PersonEquipment } from '@FisherCore';
import { FuiEquipment } from './Equipment';
import { FuiItem } from '../item';

interface FuiPersonEquipmentProps {
  personEquipment: PersonEquipment | undefined;
}

const FuiPersonEquipment: FC<FuiPersonEquipmentProps> = observer(({ personEquipment }) => {
  if (personEquipment === undefined) return <div>loading</div>;

  return (
    <Fragment>
      {!personEquipment.isEmpty ? (
        <FuiEquipment equipment={personEquipment.equipment!} />
      ) : (
        <FuiItem item={personEquipment.emptyEquipment} />
      )}
    </Fragment>
  );
});

export { FuiPersonEquipment };
