const robotlib = require('robotlib');

/**
 * Telemetry
 * @param {Object} config
 * @return {Object}
 */
module.exports = (socket, config, { sensors }) => {
  const { lidar, main } = sensors;

  let lidarData = {};
  let imuData = {};
  let odometryData = {};
  let lastTimestamp = new Date();
  let fps = {};

  /**
   * Constructor
   */
  function constructor() {
    setInterval(setFps, config.loopTime);
    setInterval(emit, 100);

    if (lidar) {
      lidar.on('data', onLidarData);
    }

    if (main) {
      main.on('odometry', ({ heading }) => { imuData = { heading }; });
    }
  }

  /**
   * Emit
   */
  function emit() {
    socket.emit('data', {
      lidar: lidarData,
      imu: imuData,
      fps,
    });

    lidarData = {};
  }

  /**
   * Lidar data event handler
   * @param {Object} data
   */
  function onLidarData(data) {
    data.forEach(({ angle, distance }) => {
      const index = robotlib.utils.sensor.lidar.normalizeAngle(Math.round(angle));

      lidarData[index] = distance;
    });
  }

  /**
   * Sets the fps
   */
  function setFps() {
    const currentTimestamp = new Date();

    fps = {
      target: 1000 / config.loopTime,
      actual: 1000 / (currentTimestamp - lastTimestamp),
    };

    lastTimestamp = currentTimestamp;
  }

  constructor();

  return {};
};
