module.exports = {
  robot: {
    diameter: 17.5, // cm
  },
  timeout: { // ms
    start: 1000,
    pause: 100,
  },
  speed: { // cms/s
    straight: {
      max: 50,
      fast: 50,
      medium: 35,
      slow: 20,
      precision: 5,
    },
    turn: {
      fast: 30,
      slow: 10,
    },
    rotate: {
      fast: 30,
      slow: 5,
      correction: 1,
    },
    lineFollowing: 15,
  },
  distance: { // mm
    gap: {
      width: 4, // cm (options: 30, 15, 8, 4)
    },
  },
  pid: {
    lineFollowing: {
      Kp: 0.5,
    },
  },
  obstacles: {
    wall: {
      close: 350, // mm
      far: 750, // mm
    },
    can: {
      diameter: 6.5, // cm
    },
  },
  color: {
    green: [0, 128, 0],
    orange: [128, 82, 0],
    red: [128, 0, 0],
  },
  loopTime: 1000 / 50, // ms
};
