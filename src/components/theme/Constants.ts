import { common, yellow, grey, green } from '@mui/material/colors';

const FuiSize = {
  item: {
    size: 50,
  },
};

const FuiColor = {
  common,

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
