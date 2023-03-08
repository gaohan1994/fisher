import { FC } from 'react';
import { Stack } from '@mui/material';
import { IAttributeKeys, Person } from '@FisherCore';
import { PanelAttribute } from '../attribute';

interface Props {
  person: Person;
}
const FuiPersonAttributePanel: FC<Props> = ({ person }) => (
  <Stack sx={{ width: 150 }}>
    <PanelAttribute attribute={IAttributeKeys.MaxHp} value={person.attributePanel.MaxHp} />
    <PanelAttribute attribute={IAttributeKeys.AttackPower} value={person.attributePanel.AttackPower} />
    <PanelAttribute attribute={IAttributeKeys.DefencePower} value={person.attributePanel.DefencePower} />
    <PanelAttribute attribute={IAttributeKeys.DefenceCorruption} value={person.attributePanel.DefenceCorruption} />
  </Stack>
);

export { FuiPersonAttributePanel };
