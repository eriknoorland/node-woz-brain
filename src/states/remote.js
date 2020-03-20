// const getInitialPosition = require('../utils/getInitialPosition'); // FIXME get from robotlib
// const config = require('../config');

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
    logger.log('constructor', 'remote');
  }

  /**
   * Start
   */
  function start() {
    logger.log('start', 'remote');

    // const { x, y } = getInitialPosition(); // FIXME get initial pose util
    const x = 190; // FIXME rear distance
    const y = (arena.height / 4); // FIXME left distance + (arena.height / 2)
    odometry.setStartPose(x, y + (arena.height / 2));

    socket.on('remote.forward', forward);
    socket.on('remote.reverse', reverse);
    socket.on('remote.stop', stopMotors);
    socket.on('remote.rotateLeft', rotateLeft);
    socket.on('remote.rotateRight', rotateRight);
    socket.on('remote.resetIMU', main.resetIMU);
  }

  /**
   * Start
   */
  function stop() {
    logger.log('stop', 'remote');

    socket.removeListener('remote.forward', forward);
    socket.removeListener('remote.reverse', reverse);
    socket.removeListener('remote.stop', stopMotors);
    socket.removeListener('remote.rotateLeft', rotateLeft);
    socket.removeListener('remote.rotateRight', rotateRight);
    socket.removeListener('remote.resetIMU', main.resetIMU);
  }

  function forward() {
    logger.log('forward', 'remote');
    main.forward(250, 1000);
  }

  function reverse() {
    logger.log('reverse', 'remote');
    main.reverse(200);
  }

  function stopMotors() {
    logger.log('stop motors', 'remote');
    main.stop()
      .then(main.stop.bind(null, 1));
  }

  function rotateLeft() {
    logger.log('rotateLeft', 'remote');

    main.rotate(100, -90)
      .then(main.stop.bind(null, 1));
  }

  function rotateRight() {
    logger.log('rotateRight', 'remote');

    main.rotate(100, 90)
      .then(main.stop.bind(null, 1));
  }

  constructor();

  return {
    start,
    stop,
  };
};
