import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useBrowserHidden from './BrowserHiddenHook';
import { useCore } from '../core';

const BrowserHiddenDetector = observer(() => {
  const core = useCore();
  const { activeComponent } = core;
  const isHidden = useBrowserHidden();

  useEffect(() => {
    if (isHidden && activeComponent !== undefined) {
      activeComponent.pause();
    }

    if (!isHidden && activeComponent !== undefined && activeComponent.isPaused === true) {
      activeComponent?.continue(core);
    }
  }, [isHidden, activeComponent]);

  return null;
});

export { BrowserHiddenDetector };
