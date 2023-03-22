import React from 'react';
import { Assets, IAttributeKeys } from '@FisherCore';
import { Avatar, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { makeFuiAttribute } from './Attribute';

interface PanelAttributeProps {
  attribute: IAttributeKeys[number];
  value: number | string;
}

const PanelAttribute: React.FC<PanelAttributeProps> = ({ attribute, value }) => {
  const fuiAttribute = makeFuiAttribute(attribute as IAttributeKeys);
  return (
    <ListItem secondaryAction={`${value}`} disablePadding>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1}>
            <Avatar src={Assets[fuiAttribute.key]} sx={{ width: 24, height: 24 }} />
            <Typography>{fuiAttribute.label}</Typography>
          </Stack>
        }
      />
    </ListItem>
  );
};

export { PanelAttribute };
