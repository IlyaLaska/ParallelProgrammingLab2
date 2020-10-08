'use strict';

const {Worker, isMainThread, parentPort} = require('worker_threads');
const Process = require('./Process.js');

parentPort.postMessage('online');

parentPort.on('message', (msg) => {
    // console.log('CPU HAS: ', msg);
    setTimeout(() => {
        console.log(`Process ${msg.id} with delay ${msg.originalDelay} (total: ${msg.arrivalDelay}) took ${msg.execTime} to complete`);
        parentPort.postMessage('ready');
    }, msg.execTime);
});

// setInterval()