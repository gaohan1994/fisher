import { FC } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher, FuiAppbar } from '@Fui';
import FisherCoreDemo from './FisherCoreDemo';

export const FisherLauncher: FC = observer(() => {
  return (
    <FuiTheme>
      <FuiNotifycation />
      <FuiAppbar />
      {core.gameReady ? <FisherCoreDemo /> : <FuiLauncher />}
    </FuiTheme>
  );
});
