const robotlib = require('robotlib');

/**
 * Telemetry
 * @param {Object} config
 * @return {Object}
 */
module.exports = (socket, config, { controllers, sensors }) => {
  const { odometry } = controllers;
  const { lidar, main } = sensors;

  let lidarData = {};
  let imu = {};
  let poses = [];
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
      main.on('odometry', ({ heading }) => {
        imu = { heading };
      });
    }

    if (odometry) {
      odometry.on('pose', pose => poses.push(pose));
    }
  }

  /**
   * Emit
   */
  function emit() {
    socket.emit('data', { lidar: lidarData, imu, poses, fps });

    lidarData = {};
    poses.length = 0;
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
