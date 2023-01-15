import { Fragment, FC } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher } from '@Components';
import FisherCoreDemo from './FisherCoreDemo';

export const FisherLauncher: FC = observer(() => {
  return (
    <FuiTheme>
      <FuiNotifycation />
      {core.gameReady ? <FisherCoreDemo /> : <FuiLauncher />}
    </FuiTheme>
  );
});
