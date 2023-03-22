import { FC } from 'react';
import { observer } from 'mobx-react';
import numeral from 'numeral';
import { List } from '@mui/material';
import { IAttributeKeys, Person } from '@FisherCore';
import { PanelAttribute } from '../attribute';

interface Props {
  person: Person;
}
const FuiPersonAttributePanel: FC<Props> = observer(({ person }) => (
  <List sx={{ width: '100%', maxWidth: 400 }}>
    <PanelAttribute attribute={IAttributeKeys.MaxHp} value={person.attributePanel.MaxHp} />
    <PanelAttribute
      attribute={IAttributeKeys.AttackSpeed}
      value={numeral(person.attributePanel.AttackSpeed / 1000).format('0.0')}
    />
    <PanelAttribute attribute={IAttributeKeys.AttackPower} value={person.attributePanel.AttackPower} />
    <PanelAttribute attribute={IAttributeKeys.DefencePower} value={person.attributePanel.DefencePower} />
    <PanelAttribute attribute={IAttributeKeys.DefenceCorruption} value={person.attributePanel.DefenceCorruption} />
  </List>
));

export { FuiPersonAttributePanel };
