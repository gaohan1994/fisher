import { FC } from 'react';
import { IAttributeKeys } from '@FisherCore';
import { Grid, Typography } from '@mui/material';
import { makeFuiAttribute } from './Attribute';
import { FuiColor } from '../theme';

interface PanelAttributeProps {
  attribute: IAttributeKeys[number];
  value: number | string;
}

const PanelAttribute: FC<PanelAttributeProps> = ({ attribute, value }) => {
  const fuiAttribute = makeFuiAttribute(attribute as IAttributeKeys);
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Grid item xs={8}>
        <Typography color={FuiColor.common.white}>{fuiAttribute.label}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography align="right" color={FuiColor.common.white}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

export { PanelAttribute };
