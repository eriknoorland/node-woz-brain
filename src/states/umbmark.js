const robotlib = require('robotlib');

/**
 * Remote
 * @param {Object} options
 * @return {Object}
 */
module.exports = ({ arena, logger, controllers, socket }) => {
  const { main, odometry } = controllers;
  const straightSpeed = 300;
  const rotateSpeed = 100;

  /**
   * Constructor
   */
  function constructor() {
    logger.log('constructor', 'umbmark');
  }

  /**
   * Start
   */
  function start() {
    logger.log('start', 'umbmark');

    // const { x, y } = getInitialPosition(); // FIXME get initial pose util
    const x = 190; // FIXME rear distance
    const y = (arena.height / 4); // FIXME left distance + (arena.height / 2)
    odometry.setStartPose(x, y + (arena.height / 2));

    socket.on('ArrowLeft', left);
    socket.on('ArrowRight', right);
  }

  function stop() {

  }

  async function right() {
    for (let i = 0; i < 4; i++) {
      await main.forward(straightSpeed, 1000);
      await robotlib.utils.pause(500);
      await main.rotate(rotateSpeed, 90);
      await robotlib.utils.pause(500);
    }
  }

  async function left() {
    for (let i = 0; i < 4; i++) {
      await main.forward(straightSpeed, 1000);
      await robotlib.utils.pause(500);
      await main.rotate(rotateSpeed, -90);
      await robotlib.utils.pause(500);
    }
  }

  constructor();

  return {
    start,
    stop,
  };
};
