// const getInitialPosition = require('../utils/getInitialPosition'); // FIXME get from robotlib
// const config = require('../config');

/**
 * Remote
 * @param {Object} options
 * @return {Object}
 */
module.exports = ({ arena, logger, controllers, socket }) => {
  const { main, odometry } = controllers;
  const waypoints = [];

  /**
   * Constructor
   */
  function constructor() {
    logger.log('constructor', 'waypoints');
  }

  /**
   * Start
   */
  function start() {
    logger.log('start', 'waypoints');

    // const { x, y } = getInitialPosition(); // FIXME get initial pose util
    const x = 190; // FIXME rear distance
    const y = (arena.height / 4); // FIXME left distance + (arena.height / 2)
    odometry.setStartPose(x, y + (arena.height / 2));

    socket.on('waypoints.coordinate', setCoordinate);
    socket.on('waypoints.run', run);
  }

  /**
   * Stop
   */
  function stop() {
    logger.log('stop', 'waypoints');

    socket.removeListener('waypoints.coordinate', setCoordinate);
    socket.removeListener('waypoints.run', run);
  }

  /**
   * Set coordinate
 * @param {Object} coordinate
   */
  function setCoordinate(coordinate) {
    waypoints.push(coordinate);
  }

  /**
   * Run
   */
  function run() {
    logger.log('run', 'waypoints');

    console.log(JSON.stringify(waypoints, null, 2));

    // waypoints.forEach(async (value, index, array) => {
    //   const currentPosition = index === 0 ? { x: 190, y: 1800 } : array[index - 1];
    //   const currentHeading = index === 0 ? 0 : 0;

    //   await main.goToXY(currentPosition, array[index], currentHeading);
    // });
  }

  constructor();

  return {
    start,
    stop,
  };
};
