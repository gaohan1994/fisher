import React from 'react';
import { observer } from 'mobx-react';
import {
  Avatar,
  AvatarGroup,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  styled,
} from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { core, Recipe } from '@FisherCore';
import { FuiColor, FuiIconText } from '@Fui';
import { useRecipe } from '../hook';

const NoBorderAvatar = styled(Avatar)(() => ({
  '&.MuiAvatar-root': {
    border: 'none',
  },
}));

interface Props {
  recipe: Recipe;
}

const FuiForgeRecipe: React.FC<Props> = observer(({ recipe }) => {
  const { intervalSecond, rewardItemAvatars } = useRecipe(recipe);
  const { activeRecipe, skill, isActive } = core.forge;
  const isSelected = React.useMemo(() => activeRecipe?.id === recipe.id, [activeRecipe, recipe]);
  return (
    <Card
      sx={{ bgcolor: FuiColor.primary.background, border: isSelected ? 1 : 0, borderColor: FuiColor.gold }}
      onClick={() => skill.setActiveRecipe(recipe)}
    >
      <CardActionArea>
        <CardHeader
          title={recipe.name}
          sx={{ pb: 0 }}
          avatar={
            <AvatarGroup className="ForgeRecipe">
              {rewardItemAvatars.map((avatar, index) => (
                <NoBorderAvatar key={index} src={avatar} variant="square" />
              ))}
            </AvatarGroup>
          }
          subheader={
            isSelected &&
            isActive && (
              <Typography variant="caption" color="secondary">
                正在采集
              </Typography>
            )
          }
        />
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <FuiIconText icon={<AccessAlarmIcon />} text={`锻造时间 ${intervalSecond} 秒`} />
            <FuiIconText icon={<EmojiEventsIcon />} text={`经验奖励 ${recipe.rewardExperience} 点`} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export { FuiForgeRecipe };
