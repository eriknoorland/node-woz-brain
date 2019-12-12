// const config = require('../config');

/**
 * Remote
 * @param {Object} options
 * @return {Object}
 */
module.exports = ({ logger, controllers, socket }) => {
  const { main } = controllers;

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

    socket.on('remote.forward', forward);
    socket.on('remote.reverse', reverse);
    socket.on('remote.stop', stopMotors);
    socket.on('remote.rotateLeft', rotateLeft);
    socket.on('remote.rotateRight', rotateRight);
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
  }

  function forward() {
    logger.log('forward', 'remote');
    main.forward(20);
  }

  function reverse() {
    logger.log('reverse', 'remote');
    main.reverse(20);
  }

  function stopMotors() {
    logger.log('stop motors', 'remote');
    main.stop();

    setTimeout(main.stop.bind(null, 1), 1000);
  }

  function rotateLeft() {
    logger.log('rotateLeft', 'remote');

    main.rotate(20, -90)
      .then(main.stop.bind(null, 1));
  }

  function rotateRight() {
    logger.log('rotateRight', 'remote');

    main.rotate(20, 90)
      .then(main.stop.bind(null, 1));
  }

  constructor();

  return {
    start,
    stop,
  };
};
