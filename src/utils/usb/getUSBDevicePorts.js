const serialport = require('serialport');

/**
 * Returns an object with a USB port name for each device
 * @param {Array} expectedDevices
 * @return {Promise}
 */
const getUSBDevicePorts = expectedDevices => new Promise((resolve) => {
  const findDevice = (acc, { path, vendorId, productId }) => {
    const device = expectedDevices.find(d => d.vendorId === vendorId && d.productId === productId);

    if (device) {
      acc[device.name] = path;
    }

    return acc;
  };

  serialport.list()
    .then(ports => ports.reduce(findDevice, {}))
    .then(resolve);
});

module.exports = getUSBDevicePorts;
