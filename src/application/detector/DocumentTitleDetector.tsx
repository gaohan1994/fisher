import { observer } from 'mobx-react';
import { FC, useEffect } from 'react';
import useBrowserHidden from './BrowserHiddenHook';
import { useCore } from '../core';

const DefaultDocumentTitle = 'Fisher';

const DocumentTitleDetector: FC = observer(() => {
  const { activeComponent } = useCore();
  const isHidden = useBrowserHidden();

  useEffect(() => {
    let title = DefaultDocumentTitle;

    if (activeComponent !== undefined) {
      title = '正在' + activeComponent.name;
    }

    if (isHidden) {
      title = title + '挂机中';
    }

    document.title = title;
  }, [activeComponent, isHidden]);

  return null;
});

export { DocumentTitleDetector };
