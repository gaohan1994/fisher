import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router';
import { LinearProgress, ListItemIcon, Stack, Typography } from '@mui/material';

import { FisherComponent, Timer } from '@FisherCore';
import { MenuIcon, MenuItemContainer } from './Styled';
import { useComponentMenuPath, useComponentTimer, useIsComponentActive } from './Hook';

interface IFuiMenuItem {
  component: FisherComponent;
}
export const FuiMenuItem: React.FC<IFuiMenuItem> = observer(({ component }) => {
  const navigate = useNavigate();
  const timer = useComponentTimer(component);
  const menuPath = useComponentMenuPath(component);
  const isComponentActive = useIsComponentActive(component);
  return (
    <MenuItemContainer isActive={isComponentActive} onClick={() => navigate(menuPath)}>
      {component.media && (
        <ListItemIcon>
          <MenuIcon src={component.media} />
        </ListItemIcon>
      )}
      <Stack>
        <Typography textAlign="end">{component.name}</Typography>
        {/* @todo add FuiLevelInfo when refactor end */}
        {/* {(component as any)?.level && <FuiLevelInfo level={(component as any)?.level} textAlign="end" />} */}
        {isComponentActive && <ActiveComponentMiniDashboard timer={timer} />}
      </Stack>
    </MenuItemContainer>
  );
});

interface IActiveComponentMiniDashboard {
  timer: Timer | undefined;
}
const ActiveComponentMiniDashboard: React.FC<IActiveComponentMiniDashboard> = observer(({ timer }) => (
  <Fragment>
    <Typography variant="caption" color="secondary">
      正在进行中
    </Typography>
    {timer !== undefined && <LinearProgress variant="determinate" color="progress" value={timer.progress} />}
  </Fragment>
));
