import React from 'react';
import { Assets } from '@FisherCore';
import { Avatar, ListItem, ListItemText, Stack, Typography } from '@mui/material';

import { useAttributeConstant } from '../attribute';
import { IAttribute } from './Types';

interface PanelAttributeProps {
  attribute: IAttribute;
}
export const PersonAttribute: React.FC<PanelAttributeProps> = ({ attribute }) => {
  const { key, value } = attribute;
  const { label } = useAttributeConstant(attribute);
  return (
    <ListItem secondaryAction={value} disablePadding>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1}>
            <Avatar src={Assets[key]} sx={{ width: 24, height: 24 }} />
            <Typography>{label}</Typography>
          </Stack>
        }
      />
    </ListItem>
  );
};
