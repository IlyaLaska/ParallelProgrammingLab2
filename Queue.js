'use strict';

const QUEUE_LEN = 10;

class Queue {
    constructor(queueLength) {
        // if (!queueLength) this.length = QUEUE_LEN;
        this.maxLength = queueLength ? queueLength : QUEUE_LEN;
        this.queue = [];
        this.maxQueueLength = 0;
    }

    length = () => this.queue.length;

    push = (process) => {
        this.queue.push(process);
        if (this.length() > this.maxQueueLength)
            this.maxQueueLength = this.length();
    }
    shift = () => {
        // console.dir(`Returning 1st elem of: {${this.queue}}`, {depth: 1});
        return this.queue.shift();
    }
}

module.exports = Queue;