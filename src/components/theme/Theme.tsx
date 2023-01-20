import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FC, PropsWithChildren } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(0, 30, 60)',
    },

    progress: {
      main: '#ffcd38',
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    progress: Palette['primary'];
  }
  interface PaletteOptions {
    progress?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/LinearProgress' {
  interface LinearProgressPropsColorOverrides {
    progress: true;
  }
}

const FuiTheme: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export { FuiTheme };
