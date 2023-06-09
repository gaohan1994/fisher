import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import useBrowserHidden from './BrowserHiddenHook';

const BrowserHiddenDetector = observer(() => {
  const { activeComponent } = core;
  const isHidden = useBrowserHidden();

  useEffect(() => {
    if (isHidden && activeComponent !== undefined) {
      activeComponent.pause();
    }

    if (!isHidden && activeComponent !== undefined && activeComponent.isPaused === true) {
      activeComponent?.continue();
    }
  }, [isHidden, activeComponent]);

  return null;
});

export { BrowserHiddenDetector };
