import { FC, PropsWithChildren } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(0, 30, 60)',
    },

    progress: {
      main: '#ffcd38',
    },

    progressHp: {
      main: red.A700,
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    progress: Palette['primary'];
    progressHp: Palette['primary'];
  }
  interface PaletteOptions {
    progress?: PaletteOptions['primary'];
    progressHp?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/LinearProgress' {
  interface LinearProgressPropsColorOverrides {
    progress: true;
    progressHp: true;
  }
}
declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides {
    progress: true;
    progressHp: true;
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
