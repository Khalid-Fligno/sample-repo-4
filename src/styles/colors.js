const colors = {
  black: 'rgb(0, 0, 0)', // #000000
  white: 'rgb(255, 255, 255)', // #FFFFFF
  transparent: 'rgba(0, 0, 0, 0)',
  transparentWhite: 'rgba(255, 255, 255, 0.65 )',
  transparentWhiteLight: 'rgba(255, 255, 255, 0.3 )',
  transparentWhiteLightest: 'rgba(255, 255, 255, 0.17 )',
  transparentBlackDark: 'rgba(0, 0, 0, 0.75 )',
  transparentBlackMid: 'rgba(0, 0, 0, 0.6 )',
  transparentBlackLight: 'rgba(0, 0, 0, 0.5 )',
  transparentBlackLighter: 'rgba(0, 0, 0, 0.4 )',
  transparentBlackLightest: 'rgba(0, 0, 0, 0.3 )',
  transparentCoral: 'rgba(238, 48, 66, 0.4)',
  offWhite: 'rgb(250, 250, 250)', // ##F5F5F5
  grey: {
    dark: 'rgb(113, 114, 115)', // #717273
    standard: 'rgb(188, 188, 189)', // #BCBCBD
    medium: 'rgb(210, 210, 210)', // #C8C8C8
    light: 'rgb(234, 234, 235)', // #EAEAEB
  },
  charcoal: {
    darkest: 'rgb(20, 20, 20)', // #141414
    standard: 'rgb(38, 38, 40)', // #262628
    light: 'rgb(65, 64, 66)', // #414042
    dark: 'rgb(35, 36, 44)', // #23242C
  },
  coral: {
    standard: 'rgb(238, 48, 66)', // #EE2F42
    light: 'rgb(244, 113, 126)', // #F4717E
    dark: 'rgb(236, 19, 41)', // #EC1329
    darkest: 'rgb(220, 5, 10)', // #EC1329
  },
  violet: {
    standard: 'rgb(179, 95, 165)', // #B35FA5
    light: 'rgb(214, 168, 207)', // #D6A8CF
    dark: 'rgb(156, 73, 142)', // #9C498E
  },
  green: {
    standard: 'rgb(21, 160, 140)', // #15A08C
    light: 'rgb(28, 202, 176)', // #1CCAB0
    dark: 'rgb(18, 135, 118)', // #128776
    forest: 'rgb(0, 128, 0)', // #008000
    superLight: 'rgb(230, 255, 230)', // #e6ffe6
  },
  blue: {
    standard: 'rgb(122, 155, 224)', // #7A9BE0
    light: 'rgb(131, 161, 226)', // #83A1E2
    dark: 'rgb(110, 145, 221)', // #6E91DD
    vivid: 'rgb(0, 0, 255)', // #0000FF
  },
  yellow: {
    standard: 'rgb(242, 199, 26)', // #F1D519
  },
  red:{
    standard:'rgb(255,0,0)',
    light:'rgb(255,204,203)',
    dark:'rgb(139,0,0)'
  },
  facebookBlue: 'rgb(59,89,152)', // #3B5998,
  
  headerBackground:'rgb(255, 255, 255)',
  containerBackground:'rgb(250, 250, 250)',
  themeColor:{
    backgroundColor:'rgb(250, 250, 250)',
    borderColor:'rgb(238, 48, 66)',
    fontColor:'rgb(238, 48, 66)',
    color:'rgb(238, 48, 66)',
    footerBackgroundColor:'rgb(255, 255, 255)',
    headerBackgroundColor:'rgb(255, 255, 255)',
  },
};

export default colors;
