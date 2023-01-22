import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { ComponentId, core } from '@FisherCore';
import { fuiRouteHandler } from '../route';

const visibleCoreComponents = [ComponentId.Battle, ComponentId.Mining, ComponentId.Reiki, ComponentId.Forge];

function checkIsVisibleComponent(componentId: any) {
  return visibleCoreComponents.includes(componentId);
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
                    <ListItemIcon> </ListItemIcon>
                    <ListItemText primary={componentRoute.name} />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
      </Box>
    </Drawer>
  );
});

export { FuiMenu };
