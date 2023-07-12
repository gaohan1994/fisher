import { Outlet } from 'react-router-dom';
import { Toolbar } from '@mui/material';
import { FuiMiniFight } from '@Fui';
import { BrowserHiddenDetector } from '../detector';
import { FuiAppbar, FuiMenu } from '../components';
import { GameContainer, GameMainContainer } from './Styled';

const Game = () => (
  <GameContainer>
    <BrowserHiddenDetector />
    <FuiAppbar />
    <FuiMenu />
    <FuiMiniFight />
    <GameMainContainer component="main">
      <Toolbar />
      <Outlet />
    </GameMainContainer>
  </GameContainer>
);

export { Game };
