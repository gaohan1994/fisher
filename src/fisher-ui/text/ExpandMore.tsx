import { styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExpandMore = styled((props: any) => {
  const { expand, ...others } = props;
  return <ExpandMoreIcon {...others} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export { ExpandMore };
