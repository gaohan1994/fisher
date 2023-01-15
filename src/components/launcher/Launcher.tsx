import { Container } from '@mui/material';
import { FuiArchiveCreateButton, FuiArchiveList } from '../archive';

const FuiLauncher = () => {
  return (
    <Container fixed maxWidth="sm">
      <FuiArchiveList />
      <FuiArchiveCreateButton />
    </Container>
  );
};

export { FuiLauncher };
