import React, { FC, Fragment, PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { List } from '@mui/material';
import { EquipmentItem, EquipmentSlotName } from '@FisherCore';
import { FuiItem, FuiItemProps } from '../Item';
import { FuiEquipmentSet } from './EquipmentSet';
import { FuiNormalDivider } from '../../container';
import { EquipmentAttributes } from './EquipmentAttributes';
import { FuiEquipmentActions } from './EquipmentAction';
import { EquipmentText } from './Common';

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
  const { hasEquipmentSet, hasEquipmentAction } = equipment;
  return (
    <List sx={{ pt: 0, pb: 0 }}>
      <EquipmentText>装备类型：{EquipmentSlotName[equipment.slot]}</EquipmentText>
      <FuiEquipmentContainer title="装备属性：">
        <EquipmentAttributes equipment={equipment} />
      </FuiEquipmentContainer>
      {hasEquipmentSet && (
        <FuiEquipmentContainer title="套装属性：">
          <FuiEquipmentSet equipment={equipment} />
        </FuiEquipmentContainer>
      )}
      {hasEquipmentAction && (
        <FuiEquipmentContainer title="装备特效：">
          <FuiEquipmentActions equipment={equipment} />
        </FuiEquipmentContainer>
      )}
    </List>
  );
});

interface IFuiEquipmentContainer {
  title: React.ReactNode;
}
const FuiEquipmentContainer: FC<PropsWithChildren<IFuiEquipmentContainer>> = ({ title, children }) => (
  <Fragment>
    <FuiNormalDivider space={1} />
    <EquipmentText>{title}</EquipmentText>
    {children}
  </Fragment>
);

export { FuiEquipment, FuiEquipmentDetail };
