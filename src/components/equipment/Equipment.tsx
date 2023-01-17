import { FC } from 'react';
import { observer } from 'mobx-react';
import { List, ListItem, Typography } from '@mui/material';
import { EquipmentItem, store } from '@FisherCore';
import { FuiItem } from '../item';
import { FuiColor } from '../theme';
import { makeFuiAttributeBonusText } from '../attribute';
import { FuiEquipmentSet } from './EquipmentSet';

interface FuiEquipmentProps {
  equipment: EquipmentItem;
}

const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment }) => {
  const renderEquipmentPopover = () => {
    const listItemSx = { p: 0, mt: 1 };
    return (
      <List sx={{ pt: 0 }}>
        {equipment.hasAttributes && <ListItem sx={listItemSx}>{renderEquipmentAttributes()}</ListItem>}
        {equipment.hasEquipmentSet && <ListItem sx={listItemSx}>{renderEquipmentSet()}</ListItem>}
      </List>
    );
  };

  const renderEquipmentAttributes = () => {
    const { attributes } = equipment;
    return attributes.map((attribute) => (
      <Typography key={attribute.key} variant="caption" color={FuiColor.equipment.attribute}>
        {makeFuiAttributeBonusText(attribute.key, attribute.value)}
      </Typography>
    ));
  };

  const renderEquipmentSet = () => {
    const equipmentSet = store.findEquipmentSetById(equipment.equipmentSetId ?? '');
    return <FuiEquipmentSet equipmentSet={equipmentSet} />;
  };

  return <FuiItem item={equipment} renderPopover={renderEquipmentPopover} />;
});

export { FuiEquipment };
