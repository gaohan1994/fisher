import { common, yellow, grey, green, blueGrey, brown } from '@mui/material/colors';

const FuiSize = {
  item: {
    size: 50,
  },
};

const FuiColor = {
  common,

  main: {
    background: '#303030',
  },

  appbar: {
    background: grey.A700,
  },

  menu: {
    background: grey[800],
  },

  card: {
    background: blueGrey[900],
  },

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
