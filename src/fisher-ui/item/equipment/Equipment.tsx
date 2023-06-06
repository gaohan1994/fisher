import { FC } from 'react';
import { observer } from 'mobx-react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { EquipmentItem, FisherActions, IEquipmentAttribute, store } from '@FisherCore';
import { FuiColor } from '../../theme';
import { ActionId } from '@FisherCore';
import { makeFuiAttributeBonusText } from '../../attribute';
import { FuiItem, FuiItemProps } from '../Item';
import { FuiEquipmentSet } from './EquipmentSet';

interface IEquipmentAttributeText {
  attribute: IEquipmentAttribute;
}
const EquipmentAttributeText: FC<IEquipmentAttributeText> = ({ attribute }) => (
  <Typography variant="caption" color={FuiColor.equipment.attribute}>
    {makeFuiAttributeBonusText(attribute.key, attribute.value)}
  </Typography>
);

interface IEquipmentActionText {
  actionId: ActionId;
}
const EquipmentActionText: FC<IEquipmentActionText> = ({ actionId }) => {
  const action = new FisherActions[actionId]();
  return (
    <Box>
      <Typography variant="caption" component="div" color={FuiColor.equipment.action}>
        {`特效 · ${action.name}`}
      </Typography>
      <Typography variant="caption" component="div" color={FuiColor.equipment.action}>
        {action.desc}
      </Typography>
    </Box>
  );
};

interface FuiEquipmentDetailProps {
  equipment: EquipmentItem;
}
const FuiEquipmentDetail: FC<FuiEquipmentDetailProps> = observer(({ equipment }) => {
  const { hasAttributes, attributes, hasEquipmentSet, equipmentSetId, hasEquipmentAction, actionIds } = equipment;
  const listItemSx = { p: 0, mt: 1 };

  const renderEquipmentSet = () => {
    if (!hasEquipmentSet) {
      return null;
    }

    const equipmentSet = store.findEquipmentSetById(equipmentSetId!);
    return (
      <ListItem sx={listItemSx} key={equipmentSet.id}>
        <FuiEquipmentSet equipmentSet={equipmentSet} />
      </ListItem>
    );
  };

  return (
    <List sx={{ pt: 0, pb: 0, minWidth: 200 }}>
      {hasAttributes &&
        attributes.map((attribute) => (
          <ListItem sx={listItemSx} key={attribute.key}>
            <EquipmentAttributeText attribute={attribute} />
          </ListItem>
        ))}
      {renderEquipmentSet()}
      {hasEquipmentAction &&
        actionIds.map((actionId) => (
          <ListItem sx={listItemSx} key={actionId}>
            <EquipmentActionText actionId={actionId as ActionId} />
          </ListItem>
        ))}
    </List>
  );
});

interface FuiEquipmentProps extends Omit<FuiItemProps, 'item'> {
  equipment: EquipmentItem;
}
const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment, ...rest }) => (
  <FuiItem {...rest} item={equipment} itemDetail={<FuiEquipmentDetail equipment={equipment} />} />
));

export { FuiEquipment, FuiEquipmentDetail };
