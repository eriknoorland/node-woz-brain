module.exports = {
  robot: {
    diameter: 175, // mm
  },
  timeout: { // ms
    start: 1000,
    pause: 100,
  },
  speed: { // mm/s
    straight: {
      max: 500,
      fast: 500,
      medium: 350,
      slow: 200,
      precision: 50,
    },
    turn: {
      fast: 300,
      slow: 100,
    },
    rotate: {
      fast: 300,
      slow: 50,
      correction: 10,
    },
    lineFollowing: 150,
  },
  distance: { // mm
    gap: {
      width: 40, // mm (options: 300, 150, 80, 40)
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
      diameter: 65, // mm
    },
  },
  color: {
    green: [0, 128, 0],
    orange: [128, 82, 0],
    red: [128, 0, 0],
  },
  loopTime: 1000 / 50, // ms
};
