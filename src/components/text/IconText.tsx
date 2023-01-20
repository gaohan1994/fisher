import React, { FC, PropsWithChildren } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  text: React.ReactNode;
}
const FuiIconText: FC<PropsWithChildren<Props>> = ({ text, icon, children }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <Typography variant="caption" sx={{ ml: 1 }}>
        {text}
      </Typography>
      {children}
    </Box>
  );
};

export { FuiIconText };
