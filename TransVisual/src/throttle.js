export class Throttle {
    constructor(fps, beforeTimeout = true) {
        this.timeout = null;
        this.fps = fps;
        this.time = Math.round(1000 / this.fps);
        this.beforeTimeout = beforeTimeout;
    }

    run(func, ...arg) {
        // Handle too fast input by throttle
        if (!this.timeout) {
            if (this.beforeTimeout) {
                this.timeout = setTimeout(function () { this.timeout = null; }.bind(this), this.time);
                return func(...arg);
            } else {
                this.timeout = new Promise(function (resolve, reject) {
                    setTimeout(function () { this.timeout = null; resolve(func()); }, this.time);
                }.bind(this));
                return this.timeout
            }

        }
    }
}