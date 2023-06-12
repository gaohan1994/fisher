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
  <List sx={{ width: '100%' }}>
    <PanelAttribute attribute={IAttributeKeys.MaxHp} value={numeral(person.attributePanel.MaxHp).format('0')} />
    <PanelAttribute
      attribute={IAttributeKeys.AttackSpeed}
      value={numeral(person.attributePanel.AttackSpeed / 1000).format('0.0')}
    />
    <PanelAttribute
      attribute={IAttributeKeys.AttackPower}
      value={numeral(person.attributePanel.AttackPower).format('0.0')}
    />
    <PanelAttribute
      attribute={IAttributeKeys.DefencePower}
      value={numeral(person.attributePanel.DefencePower).format('0.0')}
    />
    <PanelAttribute
      attribute={IAttributeKeys.DefenceCorruption}
      value={numeral(person.attributePanel.DefenceCorruption).format('0.0')}
    />
  </List>
));

export { FuiPersonAttributePanel };
