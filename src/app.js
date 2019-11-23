require('dotenv').config();

const serialport = require('serialport');
const shell = require('shelljs');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const ydlidar = require('node-ydlidar');
const MainController = require('woz-main-controller');
const robotlib = require('robotlib');
const config = require('./config');
const states = require('./states');
const telemetryController = require('./controllers/telemetry');
const getUSBDevicePorts = require('./utils/usb/getUSBDevicePorts');

const app = express();
const server = http.Server(app);
const io = socketio(server);
const logger = robotlib.utils.logger(io);
const defaultStateOptions = { logger, controllers: {}, sensors: {} };
const expectedUSBDevices = [
  { vendorId: '10c4', productId: 'ea60', name: 'lidar' },
  { vendorId: '16c0', productId: '0483', name: 'main' }
];

let mainController;
let state;

app.use(express.static(process.env.TELEMETRY_PUBLIC_FOLDER));

/**
 * Init
 */
function init() {
  logger.log('initialize');
  logger.log('server started', 'telemetry', 'green');

  getUSBDevicePorts(expectedUSBDevices)
    .then(initUSBDevices)
    .then(initTelemetry)
    .then(updateStateOptions);
}

io.on('connection', (socket) => {
  logger.log('client connected', 'telemetry', 'green');

  socket.on('disconnect', () => {
    logger.log('client disconnected', 'telemetry', 'yellow');
  });

  socket.on('start', onStart.bind(null, socket));
  socket.on('stop', onStop);
  socket.on('shutdown', onShutdown);

  socket.emit('setup', {
    states: states,
    sensors: ['lidar', 'imu'],
    name: 'Woz',
  });
});

/**
 * Start event handler
 * @param {socket} socket
 * @param {int} stateIndex
 */
function onStart(socket, stateIndex) {
  if (stateIndex === null) {
    logger.log('No state selected', 'error', 'red');
    return;
  }

  const selectedState = states[stateIndex];

  logger.log(`start "${selectedState.name}" state`);

  state = selectedState.module({ ...defaultStateOptions, socket });
  state.start();
}

/**
 * Stop event handler
 */
function onStop() {
  return new Promise((resolve) => {
    logger.log('stop');

    if (state) {
      state.stop();
      state = null;
    }

    shell.exec('touch ./src/config.js');

    resolve();
  });
}

/**
 * Shutdown event handler
 */
function onShutdown() {
  logger.log('shutdown', 'app', 'red');
  shell.exec('sudo shutdown -h now');
}

/**
 *
 * @param {String} portName
 * @return {Object}
 */
function initMainController(portName) {
  mainController = MainController(portName);

  mainController.init()
    .then(() => {
      logger.log('main controller initialized!', 'app', 'cyan');
    });

  return mainController;
}

/**
 *
 * @param {String} portName
 * @return {Object}
 */
function initLidar(portName) {
  const lidar = ydlidar(portName);

  lidar.init()
    .then(() => {
      logger.log('lidar initialized!', 'app', 'cyan');
    });

  return lidar;
}

/**
 *
 * @param {Object} usbPorts
 * @return {Promise}
 */
function initUSBDevices(usbPorts) {
  logger.log('initialize usb devices');

  return new Promise((resolve) => {
    const resolveObject = {};

    if (usbPorts.main) {
      resolveObject.main = initMainController(usbPorts.main);
    }

    if (usbPorts.lidar) {
      resolveObject.lidar = initLidar(usbPorts.lidar);
    }

    resolve(resolveObject);
  });
}

/**
 *
 * @param {Object} usbDevices
 * @return {Promise}
 */
function initTelemetry(usbDevices) {
  const { lidar, main } = usbDevices;

  logger.log('initialize telemetry');

  return new Promise((resolve) => {
    telemetryController(io, config, {
      sensors: { main, lidar },
    });

    resolve(usbDevices);
  });
}

/**
 *
 * @param {Object} usbDevices
 * @return {Promise}
 */
function updateStateOptions({ lidar, main }) {
  logger.log('update state options');

  return new Promise((resolve) => {
    defaultStateOptions.controllers.main = main;
    defaultStateOptions.sensors.lidar = lidar;

    resolve();
  });
}

server.listen(3000, init);
