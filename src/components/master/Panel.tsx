import { FC } from 'react';
import { Stack } from '@mui/material';
import { core, IAttributeKeys } from '@FisherCore';
import { PanelAttribute } from '../attribute';

const FuiMasterPanel: FC = () => {
  const { master } = core;

  return (
    <Stack sx={{ width: 150 }}>
      <PanelAttribute attribute={IAttributeKeys.MaxHp} value={master.attributePanel.MaxHp} />
      <PanelAttribute attribute={IAttributeKeys.AttackPower} value={master.attributePanel.AttackPower} />
      <PanelAttribute attribute={IAttributeKeys.DefencePower} value={master.attributePanel.DefencePower} />
      <PanelAttribute attribute={IAttributeKeys.DefenceCorruption} value={master.attributePanel.DefenceCorruption} />
    </Stack>
  );
};

export { FuiMasterPanel };
