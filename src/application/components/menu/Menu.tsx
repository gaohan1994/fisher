import { MenuList, Toolbar } from '@mui/material';
import { MenuDrawer } from './Styled';
import { FuiMenuItem } from './MenuItem';
import { useVisibleComponentMenu } from './Hook';

const FuiMenu = () => {
  const menus = useVisibleComponentMenu();
  return (
    <MenuDrawer variant="permanent">
      <Toolbar />
      <MenuList>
        {menus.map(([id, component]) => (
          <FuiMenuItem key={id} component={component} />
        ))}
      </MenuList>
    </MenuDrawer>
  );
};

export { FuiMenu };
