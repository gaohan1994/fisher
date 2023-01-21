import { FC } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher } from '@Fui';
import { GameRouterProvider } from './router';

const Application: FC = observer(() => (
  <FuiTheme>
    <FuiNotifycation />
    {core.gameReady ? <GameRouterProvider /> : <FuiLauncher />}
  </FuiTheme>
));

export { Application };
