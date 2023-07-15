import { Box, styled } from '@mui/material';

export const GameContainer = styled(Box)(() => ({ display: 'flex' }));

export const GameMainContainer = styled(Box)(({ theme }) => ({ flexGrow: 1, padding: theme.spacing(2) }));
