import { Toolbar, Container } from '@mui/material';
import { FuiArchiveCreateButton, FuiArchiveList } from '../archive';
import { FuiAuthor } from './Author';
import { FuiLauncherTitle } from './LauncherTitle';

const FuiLauncher = () => (
  <Container fixed maxWidth="sm" sx={{ pt: 2 }}>
    <Toolbar />
    <FuiLauncherTitle />
    <FuiAuthor />
    <FuiArchiveList />
    <FuiArchiveCreateButton />
  </Container>
);

export { FuiLauncher };
