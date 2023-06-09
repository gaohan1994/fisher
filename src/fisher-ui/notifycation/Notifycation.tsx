import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { CoreInformationLoading } from './InformationLoadingDialog';
import { CoreInformationAlerts } from './InformationAlertsDialog';
import { CoreInformationTips } from './InformationTipsDialog';
import { NotifycationAlerts } from './NotifycationAlerts';

const FuiNotifycation: FC = observer(() => {
  const { information } = core;
  return (
    <Fragment>
      <CoreInformationLoading information={information} />
      <CoreInformationAlerts information={information} />
      <CoreInformationTips information={information} />
      <NotifycationAlerts />
    </Fragment>
  );
});

export { FuiNotifycation };
