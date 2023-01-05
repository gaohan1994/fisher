import { observer } from 'mobx-react';
import { Container, Typography } from '@mui/material';
import { core } from '@FisherCore';

export const FisherPromptDemo = observer(() => {
  const { prompt } = core;
  return (
    <Container sx={{ position: 'fixed', left: 10, bottom: 10 }}>
      {prompt.quene.map((item, index) => (
        <Typography key={`${item.item.id}${index}`}>
          获得：{item.item.name} x {item.quantity}
        </Typography>
      ))}
    </Container>
  );
});
