export default {
  iphone55: {
    os: "ios",
    width: 1242,
    height: 2208
  },
  iphone65: {
    os: "ios",
    width: 1242,
    height: 2688
  },
  android6: {
    os: "android",
    width: 1300,
    height: 2540
  },
  ipad_portrait: {
    os: "ios",
    width: 2048,
    height: 2732
  },
  nexus_7: {
    os: "android",
    width: 1500,
    height: 2350
  },
  nexus_9: {
    os: "android",
    width: 2000,
    height: 2900
  },
  nexus_10: {
    os: "android",
    width: 2200,
    height: 3140
  },
  android_10_anonym: {
    os: "android",
    width: 2200,
    height: 3274
  }
}

// la taille des canvas android ayant été fixée arbitrairement, elle est n'est pet-être pas idéale pour une disposition harmonieuse des screenshots sans device
// il faudrait peut-être leur donner des proportions correspondantes à celle des screenshots attendus
// ça implique de changer aussi le css dans Canvas.js
