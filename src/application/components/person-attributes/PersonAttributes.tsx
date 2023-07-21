import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Person } from '@FisherCore';

import { usePersonAttributes } from './Hook';
import { PersonAttribute } from './PersonAttribute';

interface PersonAttributesProps {
  person: Person;
}
export const PersonAttributes: FC<PersonAttributesProps> = observer(({ person }) => {
  const attributes = usePersonAttributes(person);
  return (
    <Fragment>
      {attributes.map((item) => (
        <PersonAttribute key={item.key} attribute={item} />
      ))}
    </Fragment>
  );
});
