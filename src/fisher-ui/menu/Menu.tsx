import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Stack, Toolbar } from '@mui/material';
import { ComponentId, core } from '@FisherCore';
import { fuiRouteHandler } from '../route';
import { isDevelopment } from '../env';

const visibleComponents = [
  ComponentId.Master,
  ComponentId.Bank,
  ComponentId.Battle,
  ComponentId.Mining,
  ComponentId.Reiki,
  ComponentId.Forge,
  ComponentId.Cook,
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
        width: 70,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 70,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {fuiRouteHandler.values.map(([id, componentRoute]) => {
            if (checkIsVisibleComponent(id)) {
              const { component } = componentRoute as any;
              return (
                <ListItem key={id} disablePadding>
                  <ListItemButton
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                    selected={activeComponentId === id}
                    onClick={() => navigate(componentRoute.path)}
                  >
                    <Stack>
                      {component?.media && <Avatar sx={{ width: 30, height: 30 }} src={component?.media} />}
                      <ListItemText primary={componentRoute.name} />
                    </Stack>
                  </ListItemButton>
                </ListItem>
              );
            }
            return null;
          })}
        </List>
      </Box>
    </Drawer>
  );
});

export { FuiMenu };
