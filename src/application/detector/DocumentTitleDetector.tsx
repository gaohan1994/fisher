import { observer } from 'mobx-react';
import { FC, useEffect } from 'react';
import { core } from '@FisherCore';
import useBrowserHidden from './BrowserHiddenHook';

const DefaultDocumentTitle = 'Fisher';

const DocumentTitleDetector: FC = observer(() => {
  const { activeComponent } = core;
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
