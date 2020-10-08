'use strict';

// let processCounter = 0;
// // let completedProcesses = 0;
// let waitTimeAddition = 0;

class Process {
    static processCounter = 0;
    static waitTimeAddition = 0;
    constructor() {
        // super(props);
        // if (processCounter < PROCESS_COUNT) {
            this.id = Process.processCounter++;
            this.execTime = Math.floor(Math.random() * 180 + 5);
            this.originalDelay = Math.floor(Math.random() * 100);//DONE//TODO What is the best delay / exec time combo
            Process.waitTimeAddition += this.originalDelay;
            this.arrivalDelay = Process.waitTimeAddition;
            // this.arrivalDelay = Math.floor(Math.random() * 10);
            // console.log(this.id);
        // }
    }
}

module.exports = Process;