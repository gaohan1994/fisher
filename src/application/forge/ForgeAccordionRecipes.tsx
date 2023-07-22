import { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Recipe } from '@FisherCore';
import { ForgePreview } from '../components';

interface IForgeAccordionRecipes {
  summary: React.ReactNode;
  recipes: Recipe[];
}
const ForgeAccordionRecipes: FC<IForgeAccordionRecipes> = ({ summary, recipes }) => (
  <Accordion defaultExpanded={true}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      {summary}
    </AccordionSummary>
    <AccordionDetails>
      <Grid container spacing={2}>
        {recipes.map((item) => (
          <Grid item xs={6} key={item.id}>
            <ForgePreview recipe={item} />
          </Grid>
        ))}
      </Grid>
    </AccordionDetails>
  </Accordion>
);

export { ForgeAccordionRecipes };
