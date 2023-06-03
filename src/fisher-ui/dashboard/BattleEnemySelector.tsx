import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { core } from '@FisherCore';
import { BattleEnemyCard } from './BattleEnemyCard';

interface IBattleEnemySelector {
  onSelectEnemyItem: () => void;
}
const BattleEnemySelector: React.FC<IBattleEnemySelector> = observer(({ onSelectEnemyItem }) => {
  const { battle } = core;
  const { packages } = battle;
  return (
    <React.Fragment>
      {packages.map((battleArea) => (
        <Accordion key={battleArea.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={battleArea.id}>
            <Typography>{battleArea.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {battleArea.enemies.map((enemyItem) => (
                <Grid item xs={4} key={enemyItem.id}>
                  <BattleEnemyCard enemyItem={enemyItem} onSelectEnemyItem={onSelectEnemyItem} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
});

export { BattleEnemySelector };
