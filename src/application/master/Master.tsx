import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Avatar, CardHeader, Grid, Stack } from '@mui/material';
import { FuiExperienceDetail } from '@Fui';

import { PageBackpack } from '../backpack';
import { useMaster } from '../core';
import {
  CardHeaderText,
  FuiLevel,
  ItemPopoverVariant,
  ModuleCard,
  PersonAttributes,
  PersonEquipments,
} from '../components';
import { useMasterDisplayName, useMasterExperience, useMasterPerson } from './Hook';
import { MasterContainer } from './Styled';
import { HealPotionManager } from '../components/potion';

const PageMaster: FC = observer(() => {
  const master = useMaster();
  const person = useMasterPerson();
  const name = useMasterDisplayName();
  const experience = useMasterExperience();

  const title = (
    <Stack direction="row">
      <CardHeaderText sx={{ mr: 2 }}>{name}</CardHeaderText>
      <FuiLevel experience={experience} />
    </Stack>
  );

  return (
    <Fragment>
      <MasterContainer>
        <ModuleCard header={<CardHeader avatar={<Avatar src={master.media} />} title={title} />}>
          <FuiExperienceDetail experience={experience} />
        </ModuleCard>
        <Grid container spacing={2}>
          <Grid item xs>
            <ModuleCard title="装备">
              <PersonEquipments person={person} variant={ItemPopoverVariant.Click} />
            </ModuleCard>
          </Grid>
          <Grid item xs>
            <ModuleCard title="属性">
              <PersonAttributes person={person} />
            </ModuleCard>
          </Grid>
          <Grid item xs>
            <HealPotionManager />
          </Grid>
        </Grid>
      </MasterContainer>
      <PageBackpack />
    </Fragment>
  );
});

export { PageMaster };
