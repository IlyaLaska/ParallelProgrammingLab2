'use strict';

const {Worker, isMainThread} = require('worker_threads');

const Process = require('./Process.js');
const Queue = require('./Queue.js');

const PROCESS_COUNT = 200;

const fillQueues = () => {
    for (let i = 0; i < PROCESS_COUNT; i++) {
        const queueSelector = Math.round(Math.random());
        const newProcess = new Process();
        console.log(`Process ${newProcess.id} will go to Queue ${queueSelector+1}`);
        setTimeout(() => {
            if (queueSelector) queue1.push(newProcess);
            else queue2.push(newProcess);
        }, newProcess.arrivalDelay);
    }
}
//one is empty, other not - 1st one is continuously checked, 2nd is not for some reason
const handleWorkerMessage = (msg, queueThis, queueOther, workerThis, workerOther) => {
    if ((!queueThis.length() && !queueOther.length()) || !queueThis.length()) {//both queues are empty OR My Queue is empty
        if (completedProcesses >= PROCESS_COUNT) {//completed all processes
            console.log(`Completed all ${completedProcesses} processes`);
            console.log(`Q1 Max Len: ${queue1.maxQueueLength}, Q2 Max Len: ${queue2.maxQueueLength}`)
            process.exit(556);
        } else setTimeout(() => {//rerun after 0.5 sec
            return handleWorkerMessage(msg, queueThis, queueOther, workerThis, workerOther);
        }, 500);
    } else {
        if (msg === 'online' || msg === 'ready') {
            //Other Queue is backed up - free it up
            if (queueOther.length() > queueOther.maxLength && queueThis.length() <= queueThis.maxLength) {
                console.log(`QThis Len: ${queueThis.length()}, QOther Len: ${queueOther.length()}. Helping!`)
                workerThis.postMessage(queueOther.shift());
            }
            else
                workerThis.postMessage(queueThis.shift());
        }
    }
}


let queue1 = new Queue();
let queue2 = new Queue();
let completedProcesses = 0;

fillQueues();

const worker1 = new Worker('./CPU.js', {});
const worker2 = new Worker('./CPU.js', {});

worker1.on('message', (msg) => {
    if (msg === 'ready') //{
        completedProcesses++;
    //     console.log(`COMPLETED PROCS: ${completedProcesses}`);
    //     if (completedProcesses > 85) console.log(`W1 is ready after task ${completedProcesses}`);
    // }
    handleWorkerMessage(msg, queue1, queue2, worker1, worker2);
});
worker2.on('message', (msg) => {
    if (msg === 'ready') //{
        completedProcesses++;
    //     console.log(`COMPLETED PROCS: ${completedProcesses}`);
    //     if (completedProcesses > 85) console.log(`W2 is ready after task ${completedProcesses}`);
    // }
    handleWorkerMessage(msg, queue2, queue1, worker2, worker1);
});
