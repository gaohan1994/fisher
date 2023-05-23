import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  ListItemIcon,
  MenuItem,
  MenuList,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ComponentId, core } from '@FisherCore';
import { FuiRoute, fuiRouteHandler } from '../route';
import React from 'react';
import { FuiActiveComponentMiniDashboard } from './ActiveComponent';
import { useComponentLevelColor, useComponentTimer } from './MenuHook';

const visibleComponents = [
  ComponentId.Master,
  ComponentId.Bank,
  ComponentId.Battle,
  ComponentId.Mining,
  ComponentId.Reiki,
  ComponentId.Forge,
  ComponentId.Cook,
  ComponentId.Dungeon,
];

function checkIsVisibleComponent(componentId: any) {
  return visibleComponents.includes(componentId);
}

const FuiMenu = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: 140,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: 140,
        boxSizing: 'border-box',
      },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto' }}>
      <MenuList>
        {fuiRouteHandler.values.map(([id, route]) => {
          if (checkIsVisibleComponent(id)) {
            return <FuiMenuItem key={id} id={id} route={route} />;
          }
          return null;
        })}
      </MenuList>
    </Box>
  </Drawer>
);

interface IFuiMenuItem {
  id: string;
  route: FuiRoute;
}
const FuiMenuItem: React.FC<IFuiMenuItem> = observer(({ id, route }) => {
  const navigate = useNavigate();
  const { activeComponentId } = core;
  const { component } = route;
  const timer = useComponentTimer(component);
  const isCurrentMenuActive = Boolean(activeComponentId && activeComponentId === component.id);
  return (
    <React.Fragment key={id}>
      <MenuItem onClick={() => navigate(route.path)} sx={{ justifyContent: 'space-between' }}>
        {component?.media && (
          <ListItemIcon>
            <Avatar sx={{ width: 34, height: 34 }} src={component?.media} />
          </ListItemIcon>
        )}
        <Stack>
          <Typography textAlign="end">{route.name}</Typography>
          {(component as any)?.level && <FuiMenuLevel level={(component as any)?.level} />}
          {isCurrentMenuActive && timer && <FuiActiveComponentMiniDashboard timer={timer} />}
        </Stack>
      </MenuItem>
      <Divider />
    </React.Fragment>
  );
});

interface IFuiMenuLevel {
  level: number;
}
const FuiMenuLevel: React.FC<IFuiMenuLevel> = ({ level }) => {
  const { color } = useComponentLevelColor(level);
  return (
    <Typography sx={{ color }} variant="caption" textAlign="end">
      Lv:{level}
    </Typography>
  );
};

export { FuiMenu };
