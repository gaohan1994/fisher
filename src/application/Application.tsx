import { FC } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher, FuiAppbar } from '@Components';
import { Game } from './game';

const Application: FC = observer(() => (
  <FuiTheme>
    <FuiAppbar />
    <FuiNotifycation />
    {core.gameReady ? <Game /> : <FuiLauncher />}
  </FuiTheme>
));

export { Application };
