export default {
  startTop: 165,
  startBottom: 150,
  small: {
    titleSize: 70,
    subtitleSize: 70,
    titleToTitle: 95,
    titleToSubtitle: 25,
    subtitleToSubtitle: 75,
    titleToDevice: -22,
    subtitleToDevice: -3,
    deviceToTitle: 5,
    deviceToSubtitle: 25
  },
  medium: {
    titleSize: 80,
    subtitleSize: 80,
    titleToTitle: 105,
    titleToSubtitle: 25,
    subtitleToSubtitle: 85,
    titleToDevice: -12,
    subtitleToDevice: 0,
    deviceToTitle: 50,
    deviceToSubtitle: 100
  },
  large: {
    titleSize: 100,
    subtitleSize: 100,
    titleToTitle: 125,
    titleToSubtitle: 25,
    subtitleToSubtitle: 105,
    titleToDevice: 8,
    subtitleToDevice: 27,
    deviceToTitle: 35,
    deviceToSubtitle: 55
  }
}

// il faut refaire les mesures suivantes quand on aura des mockups propres avec des margins bien définies et homogènes :
  // titleToDevice
  // subtitleToDevice
  // deviceToTitle
  // deviceToSubtitle

// subtitleToSubtitle pourrait être égal à titleToTitle
// titleToSubtitle pourrait créer un écart plus grand que l'écart titleToTitle
