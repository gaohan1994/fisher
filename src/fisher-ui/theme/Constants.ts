import { common, yellow, grey, green, blueGrey, red } from '@mui/material/colors';

const FuiSize = {
  item: {
    size: 50,
    detail: 280,
  },
};

const FuiColor = {
  common,
  red: red[600],
  green: green.A400,

  primary: {
    background: blueGrey[900],
  },

  progress: '#ffcd38',

  gold: yellow[600],

  masterPanel: {
    background: grey[800],
    avatarBgColor: grey[300],
  },

  miniBar: {},

  item: {
    desc: grey[300],
    background: grey[700],
    borderColor: common.black,
    activeBorderColor: yellow[600],
  },

  personEquipment: {},

  equipment: {
    attribute: green.A100,
  },

  equipmentSet: {
    background: grey[900],
    activeName: yellow[400],
    inactiveName: grey.A400,
    activeValue: yellow[700],
    inactiveValue: grey.A400,
  },
};

export { FuiSize, FuiColor };
