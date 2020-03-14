const robotlib = require('robotlib');

/**
 * Remote
 * @param {Object} options
 * @return {Object}
 */
module.exports = ({ arena, logger, controllers, socket }) => {
  const { main, odometry } = controllers;

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
    const x = 19; // FIXME rear distance
    const y = (arena.height / 4); // FIXME left distance + (arena.height / 2)
    odometry.setStartPose(x, y + (arena.height / 2));

    socket.on('umbmark.left', left);
    socket.on('umbmark.right', right);
  }

  function stop() {

  }

  async function right() {
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, 90);
    await robotlib.utils.pause(500);
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, 90);
    await robotlib.utils.pause(500);
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, 90);
    await robotlib.utils.pause(500);
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, 90);
  }

  async function left() {
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, -90)
    await robotlib.utils.pause(500);
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, -90)
    await robotlib.utils.pause(500);
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, -90)
    await robotlib.utils.pause(500);
    await main.forward(300, 1000);
    await robotlib.utils.pause(500);
    await main.rotate(100, -90);
  }

  constructor();

  return {
    start,
    stop,
  };
};
