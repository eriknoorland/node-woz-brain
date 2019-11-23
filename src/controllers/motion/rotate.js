const getRelativeAngleDifference = require('../math/getRelativeAngleDifference');

let imuHeading = 0;

/**
 * IMU data event handler
 * @param {Object} data
 */
const onImuData = ({ heading }) => {
  imuHeading = heading;
};

/**
 * Resolves the global IMU reading after the given amount of delay
 * @param {Number} delay
 * @return {Promise}
 */
const getImuReading = (delay) => new Promise((resolve) => {
  setTimeout(() => resolve(imuHeading), delay);
});

/**
 * Rotate
 * @param {Number} speed
 * @param {Number} correctionSpeed
 * @param {Object} main
 * @param {Number} angle [-180 / 180]
 * @return {Promise}
 */
async function rotate(speed, correctionSpeed, main, angle) {
  main.on('imu', onImuData);

  const startHeading = await getImuReading(250);
  const targetDisplacement = (startHeading + angle) % 360;

  await main.rotate(speed, angle);
  await main.stop(1);

  const displacement = await getImuReading(250);
  const correction = getRelativeAngleDifference(targetDisplacement, displacement);

  if (correction) {
    await main.rotate(correctionSpeed, correction);
    await main.stop(1);
  }

  main.off('imu', onImuData);

  return Promise.resolve();
}

module.exports = rotate;
