import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FC, PropsWithChildren } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const FuiTheme: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export { FuiTheme };
