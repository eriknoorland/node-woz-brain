const EventEmitter = require('events');

/**
 * OdometryController
 * @param {Object} main
 * @param {Number} wheelBase
 * @param {Number} distancePerTick
 * @return {Object}
 */
const odometryController = (main, wheelBase, distancePerTick) => {
  const eventEmitter = new EventEmitter();
  let lastPose;

  /**
   * Constructor
   */
  function constructor() {
    if (main) {
      main.on('odometry', onData);
    }
  }

  /**
   * Returns the last pose
   * @return {Object}
   */
  function getPose() {
    return lastPose;
  }

  /**
   * Sets the start pose of the robot
   * @param {Number} x
   * @param {Number} y
   * @param {Number} phi
   */
  function setStartPose(x, y, phi = 0) {
    lastPose = { x, y, phi };
    eventEmitter.emit('pose', lastPose);
  }

  /**
   * Odometry data event handler
   * @param {Object} data
   */
  function onData({ leftTicks, rightTicks, heading }) {
    if (!isNaN(leftTicks) && !isNaN(rightTicks)) {
      const distanceLeft = getDistance(leftTicks);
      const distanceRight = getDistance(rightTicks);
      const pose = createPose(distanceLeft, distanceRight, lastPose);

      if (JSON.stringify(pose) !== JSON.stringify(lastPose)) {
        eventEmitter.emit('pose', pose);
        lastPose = pose;
      }
    }
  }

  /**
   * Returns a pose object
   * @param {Number} distanceLeft
   * @param {Number} distanceRight
   * @param {Object} lastPose
   * @return {Object}
   */
  function createPose(distanceLeft, distanceRight, lastPose = { x: 0, y: 0, phi: 0 }) {
    const distanceCenter = (distanceLeft + distanceRight) / 2;
    const x = lastPose.x + (distanceCenter * Math.cos(lastPose.phi));
    const y = lastPose.y + (distanceCenter * Math.sin(lastPose.phi));
    const phi = lastPose.phi - ((distanceRight - distanceLeft) / wheelBase);

    return { x, y, phi };
  }

  /**
   * Returns the distance traveled in cm
   * @param {Number} ticks
   * @return {Number}
   */
  function getDistance(ticks) {
    return distancePerTick * ticks;
  }

  constructor();

  return {
    getPose,
    setStartPose,
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
  };
};

module.exports = odometryController;
