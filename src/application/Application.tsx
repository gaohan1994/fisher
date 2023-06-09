import { FC } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher } from '@Fui';
import { GameRouterProvider } from './router';
import { DocumentTitleDetector } from './detector';

const Application: FC = observer(() => (
  <FuiTheme>
    <DocumentTitleDetector />
    <FuiNotifycation />
    {core.gameReady ? <GameRouterProvider /> : <FuiLauncher />}
  </FuiTheme>
));

export { Application };
