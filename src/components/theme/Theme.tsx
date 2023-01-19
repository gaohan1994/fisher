import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FC, PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(0, 30, 60)',
    },
  },
});

const FuiTheme: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export { FuiTheme };
