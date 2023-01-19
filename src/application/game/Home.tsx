import { FuiContainer } from '@Components';
import { List, ListItem, ListSubheader, Stack, Typography } from '@mui/material';

const Home = () => {
  return (
    <FuiContainer>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Fisher
      </Typography>

      <Typography variant="body2" component="div" sx={{ mb: 1 }}>
        这是一个放置类的 MMO RPG 游戏是作者被优化之后自己在家无聊写的一个游戏，也是准备给上班族或者无聊的人拿来消遣的
      </Typography>
      <Typography variant="body2" component="div" sx={{ mb: 1 }}>
        由于只有作者一个人支持从大纲 + 找图 + 研发进度比较缓慢，游戏目前的内容还不完善，正在肝！
      </Typography>
      <Typography variant="body2" component="div" sx={{ mb: 1 }}>
        如果你有什么想法可以联系作者 Q 871418277
      </Typography>
      <Typography variant="body2" component="div" sx={{ mb: 1 }}>
        目前游戏模块分为
      </Typography>

      <Stack direction="row" spacing={2}>
        <List>
          <ListSubheader>人物模块</ListSubheader>
          <ListItem>属性</ListItem>
          <ListItem>装备</ListItem>
          <ListItem>等级</ListItem>
        </List>
        <List>
          <ListSubheader>采集模块</ListSubheader>
          <ListItem>采矿</ListItem>
          <ListItem>打坐</ListItem>
          <ListItem>锻造</ListItem>
        </List>
        <List>
          <ListSubheader>战斗模块</ListSubheader>
          <ListItem>斩妖除魔</ListItem>
        </List>
      </Stack>
    </FuiContainer>
  );
};

export { Home };
