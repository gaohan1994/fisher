import { Fragment } from 'react';
import { Container } from '@mui/material';
import { FuiArchiveCreateButton, FuiArchiveList } from '../archive';
import { FuiCoreInfo } from './Info';

const FuiLauncher = () => {
  return (
    <Fragment>
      <FuiCoreInfo />
      <Container fixed maxWidth="sm" sx={{ pt: 2 }}>
        <FuiArchiveList />
        <FuiArchiveCreateButton />
      </Container>
    </Fragment>
  );
};

export { FuiLauncher };
