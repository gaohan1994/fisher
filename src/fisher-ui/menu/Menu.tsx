import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { ComponentId, core } from '@FisherCore';
import { fuiRouteHandler } from '../route';
import { isDevelopment } from '../env';

const visibleComponents = [
  ComponentId.Master,
  ComponentId.Battle,
  ComponentId.Mining,
  ComponentId.Reiki,
  ComponentId.Forge,
];

function checkIsVisibleComponent(componentId: any) {
  return visibleComponents.includes(componentId);
}

const FuiMenu = observer(() => {
  const { activeComponentId } = core;
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 300,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 300,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {fuiRouteHandler.values.map(([id, componentRoute]) => {
            if (checkIsVisibleComponent(id)) {
              return (
                <ListItem key={id} disablePadding>
                  <ListItemButton selected={activeComponentId === id} onClick={() => navigate(componentRoute.path)}>
                    {componentRoute.component?.media && (
                      <ListItemIcon>
                        <Avatar sx={{ width: 30, height: 30 }} src={componentRoute.component?.media} />
                      </ListItemIcon>
                    )}
                    <ListItemText primary={componentRoute.name} />
                  </ListItemButton>
                </ListItem>
              );
            }
            return null;
          })}
          {isDevelopment && <ListItem onClick={() => navigate('demo')}>Demo</ListItem>}
        </List>
      </Box>
    </Drawer>
  );
});

export { FuiMenu };
