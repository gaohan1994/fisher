import { Toolbar, Container } from '@mui/material';
import { FuiAppbar } from '../appbar';
import { FuiArchiveCreateButton, FuiArchiveList } from '../archive';
import { FuiAuthor } from './Author';
import { FuiLauncherTitle } from './LauncherTitle';
import { BrowserActiveDetector } from './BrowserActiveDetector';

const FuiLauncher = () => (
  <Container fixed maxWidth="sm" sx={{ pt: 2 }}>
    <BrowserActiveDetector />
    <Toolbar />
    <FuiAppbar />
    <FuiLauncherTitle />
    <FuiAuthor />
    <FuiArchiveList />
    <FuiArchiveCreateButton />
  </Container>
);

export { FuiLauncher };
