import { FC } from 'react';
import { observer } from 'mobx-react';
import { FisherCore } from '@FisherCore';
import { FuiNotifycation, FuiTheme, FuiLauncher } from '@Fui';
import { GameRouterProvider } from './router';
import { DocumentTitleDetector } from './detector';
import { CoreContext } from './components';

/**
 * Do not initialzie fisher core in useEffect.
 * In strict mode.
 * React try render twice to check if effects clear.
 */
const core = FisherCore.create();
(window as any).core = core;

const Application: FC = observer(() => (
  <CoreContext.Provider value={core}>
    <FuiTheme>
      <DocumentTitleDetector />
      <FuiNotifycation />
      {core.gameReady ? <GameRouterProvider /> : <FuiLauncher />}
    </FuiTheme>
  </CoreContext.Provider>
));

export { Application };
