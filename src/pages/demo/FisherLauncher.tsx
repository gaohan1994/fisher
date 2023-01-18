import { FC } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher, FuiAppbar } from '@Components';
import FisherCoreDemo from './FisherCoreDemo';

export const FisherLauncher: FC = observer(() => {
  return (
    <FuiTheme>
      <FuiAppbar />
      <FuiNotifycation />
      {core.gameReady ? <FisherCoreDemo /> : <FuiLauncher />}
    </FuiTheme>
  );
});
