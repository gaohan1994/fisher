import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import usePageVisibility from './BrowserActiveHook';

const BrowserActiveDetector = observer(() => {
  const isActive = usePageVisibility();
  const { activeComponent } = core;

  useEffect(() => {
    if (!isActive && activeComponent !== undefined) {
      activeComponent.pause();
    }

    if (isActive && activeComponent !== undefined) {
      core.archiveManager.archiveHandler.loadArchive();
    }
  }, [isActive, activeComponent]);

  return null;
});

export { BrowserActiveDetector };
