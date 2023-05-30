import { common, yellow, grey, green, blueGrey, red, blue, orange, purple } from '@mui/material/colors';

const FuiSize = {
  item: {
    size: 50,
    detail: 280,
  },
};

const primaryGreen = green.A700;
const primaryBlue = blue[400];
const primaryPurple = purple.A200;
const priamryOrange = orange.A400;

const FuiColor = {
  common,
  primaryGreen,
  primaryBlue,
  primaryPurple,
  priamryOrange,

  red: red[600],

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
    Common: common.white,
    Rare: primaryBlue,
    Epic: primaryPurple,
    Legendary: priamryOrange,
  },

  equipment: {
    attribute: yellow[700],
    action: primaryGreen,
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
