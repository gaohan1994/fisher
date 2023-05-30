import { FC } from 'react';
import { PersonMode, PersonModeName } from '@FisherCore';
import { Typography } from '@mui/material';
import { usePersonModeColor } from './PersonHook';

interface IPersonModeText {
  mode: PersonMode;
}
const PersonModeText: FC<IPersonModeText> = ({ mode }) => {
  const { color } = usePersonModeColor(mode);
  return (
    <Typography sx={{ color }} variant="caption">
      {PersonModeName[mode]}
    </Typography>
  );
};

export { PersonModeText };
