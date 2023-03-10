import { FC } from 'react';
import { observer } from 'mobx-react';
import { List, ListItem, Typography } from '@mui/material';
import { EquipmentItem, store } from '@FisherCore';
import { FuiItem, FuiItemProps } from '../item';
import { FuiColor } from '../theme';
import { makeFuiAttributeBonusText } from '../attribute';
import { FuiEquipmentSet } from './EquipmentSet';

interface FuiEquipmentDetailProps {
  equipment: EquipmentItem;
}

interface FuiEquipmentProps extends Omit<FuiItemProps, 'item'> {
  equipment: EquipmentItem;
}

const FuiEquipmentDetail: FC<FuiEquipmentDetailProps> = observer(({ equipment }) => {
  const { attributes, equipmentSetId } = equipment;
  const listItemSx = { p: 0, mt: 1 };

  const renderEquipmentSet = () => {
    if (!equipment.hasEquipmentSet) {
      return null;
    }
    const equipmentSet = store.findEquipmentSetById(equipmentSetId!);
    return (
      <ListItem sx={listItemSx}>
        <FuiEquipmentSet equipmentSet={equipmentSet!} />
      </ListItem>
    );
  };

  return (
    <List sx={{ pt: 0, minWidth: 200 }}>
      {equipment.hasAttributes && (
        <ListItem sx={listItemSx}>
          {attributes.map((attribute) => (
            <Typography key={attribute.key} variant="caption" color={FuiColor.equipment.attribute}>
              {makeFuiAttributeBonusText(attribute.key, attribute.value)}
            </Typography>
          ))}
        </ListItem>
      )}
      {renderEquipmentSet()}
    </List>
  );
});
const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment, ...rest }) => (
  <FuiItem {...rest} item={equipment} itemDetail={<FuiEquipmentDetail equipment={equipment} />} />
));

export { FuiEquipment, FuiEquipmentDetail };
