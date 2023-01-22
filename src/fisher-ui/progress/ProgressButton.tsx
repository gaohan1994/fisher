import React from 'react';
import { observer } from 'mobx-react';
import { Fab, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import GppBadIcon from '@mui/icons-material/GppBad';

interface Props {
  isActive: boolean;
  value: number;
  onClick: () => void;
}
const FuiProgressButton: React.FC<Props> = observer(({ isActive, value, onClick }) => (
  <Box sx={{ position: 'relative' }}>
    <Fab aria-label="save" onClick={onClick} color={isActive ? 'secondary' : 'primary'}>
      {isActive ? <GppBadIcon /> : <PlayCircleFilledWhiteIcon />}
    </Fab>
    <CircularProgress
      size={68}
      variant="determinate"
      color="progress"
      value={isActive ? value : 0}
      sx={{
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
      }}
    />
  </Box>
));

export { FuiProgressButton };
