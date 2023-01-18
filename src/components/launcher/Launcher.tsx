import { Container } from '@mui/material';
import { FuiArchiveCreateButton, FuiArchiveList } from '../archive';

const FuiLauncher = () => (
  <Container fixed maxWidth="sm" sx={{ pt: 2 }}>
    <FuiArchiveList />
    <FuiArchiveCreateButton />
  </Container>
);

export { FuiLauncher };
