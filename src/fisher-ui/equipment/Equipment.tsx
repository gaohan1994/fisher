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

const FuiEquipmentDetail: FC<FuiEquipmentDetailProps> = ({ equipment }) => {
  const { attributes, equipmentSetId } = equipment;
  const listItemSx = { p: 0, mt: 1 };

  const renderEquipmentAttributes = () => {
    return attributes.map((attribute) => (
      <Typography key={attribute.key} variant="caption" color={FuiColor.equipment.attribute}>
        {makeFuiAttributeBonusText(attribute.key, attribute.value)}
      </Typography>
    ));
  };

  const renderEquipmentSet = () => {
    const equipmentSet = store.findEquipmentSetById(equipmentSetId ?? '');
    return <FuiEquipmentSet equipmentSet={equipmentSet} />;
  };

  return (
    <List sx={{ pt: 0, minWidth: 200 }}>
      {equipment.hasAttributes && <ListItem sx={listItemSx}>{renderEquipmentAttributes()}</ListItem>}
      {equipment.hasEquipmentSet && <ListItem sx={listItemSx}>{renderEquipmentSet()}</ListItem>}
    </List>
  );
};
const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment, ...rest }) => {
  const equipmentDetail = () => <FuiEquipmentDetail equipment={equipment} />;
  return <FuiItem {...rest} item={equipment} renderDetail={equipmentDetail} />;
});

export { FuiEquipment, FuiEquipmentDetail };
