import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { EquipmentSlot, PersonEquipment, PersonEquipmentManager } from '@FisherCore';
import { FuiEquipment } from './Equipment';

interface FuiPersonEquipmentProps {
  personEquipment: PersonEquipment | undefined;
}

const FuiPersonEquipment: FC<FuiPersonEquipmentProps> = observer(({ personEquipment }) => {
  if (personEquipment === undefined) return <div>loading</div>;

  return (
    <Fragment>
      <FuiEquipment equipment={personEquipment.equipment} />
    </Fragment>
  );
});

export { FuiPersonEquipment };
