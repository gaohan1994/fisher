import { FC, Fragment, PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { Box, List, ListItem, Typography, TypographyProps } from '@mui/material';
import { EquipmentItem, EquipmentSlotName, FisherActions, store, ActionId } from '@FisherCore';
import { FuiColor } from '../../theme';
import { makeFuiAttributeBonusText } from '../../attribute';
import { FuiItem, FuiItemProps } from '../Item';
import { FuiEquipmentSet } from './EquipmentSet';
import { FuiNormalDivider } from '../../container';

interface FuiEquipmentProps extends Omit<FuiItemProps, 'item'> {
  equipment: EquipmentItem;
}
const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment, ...rest }) => (
  <FuiItem {...rest} item={equipment} itemDetail={<FuiEquipmentDetail equipment={equipment} />} />
));

interface FuiEquipmentDetailProps {
  equipment: EquipmentItem;
}
const FuiEquipmentDetail: FC<FuiEquipmentDetailProps> = observer(({ equipment }) => {
  const { hasAttributes, attributes, hasEquipmentSet, equipmentSetId, hasEquipmentAction, actionIds } = equipment;
  const listItemSx = { p: 0, mt: 1 };

  const equipmentBaseInfo = <EquipmentText>装备类型：{EquipmentSlotName[equipment.slot]}</EquipmentText>;

  const equipmentAttributes = (
    <Fragment>
      <EquipmentText>装备属性：</EquipmentText>
      {hasAttributes &&
        attributes.map((attribute) => (
          <EquipmentText key={attribute.key} color={FuiColor.equipment.attribute}>
            {makeFuiAttributeBonusText(attribute.key, attribute.value)}
          </EquipmentText>
        ))}
    </Fragment>
  );

  const renderEquipmentSet = () => {
    if (!hasEquipmentSet) return null;

    const equipmentSet = store.findEquipmentSetById(equipmentSetId!);
    return (
      <Fragment>
        <FuiNormalDivider space={1} />
        <EquipmentText>套装属性：</EquipmentText>
        <ListItem sx={listItemSx} key={equipmentSet.id}>
          <FuiEquipmentSet equipmentSet={equipmentSet} />
        </ListItem>
      </Fragment>
    );
  };

  const renderEquipmentActions = () => {
    if (!hasEquipmentAction) return null;

    return (
      <Fragment>
        <FuiNormalDivider space={1} />
        <EquipmentText>装备特效：</EquipmentText>
        {actionIds.map(renderEquipmentAction)}
      </Fragment>
    );
  };

  const renderEquipmentAction = (actionId: string) => {
    const action = new FisherActions[actionId as ActionId]();
    return (
      <Box key={actionId}>
        <EquipmentText color={FuiColor.equipment.action}>{`特效 · ${action.name}`}</EquipmentText>
        <EquipmentText color={FuiColor.equipment.action}>{action.desc}</EquipmentText>
      </Box>
    );
  };

  return (
    <List sx={{ pt: 0, pb: 0 }}>
      {equipmentBaseInfo}
      <FuiNormalDivider space={1} />
      {equipmentAttributes}
      {renderEquipmentSet()}
      {renderEquipmentActions()}
    </List>
  );
});

const EquipmentText: FC<PropsWithChildren<TypographyProps>> = ({ children, ...rest }) => (
  <Typography variant="caption" component="div" {...(rest as any)}>
    {children}
  </Typography>
);

export { FuiEquipment, FuiEquipmentDetail };
