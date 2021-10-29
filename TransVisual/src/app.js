import { getPos } from "./drawUtil.js";
import { Transform } from "./transform.js";

class App {
    constructor() {
        this.frame = document.getElementById('frame');
        this.from = document.getElementById('from');
        this.to = document.getElementById('to');
        this.trans = new Transform(this.from, this.to);

        // this.resizeTimeout = null; this.resizeFPS = 30;
        // window.addEventListener('resize', this.resizeThrottle.bind(this));
        // this.resize();
        const canvasWidth = 700;
        const canvasHeight = 700;
        this.from.width = canvasWidth;
        this.from.height = canvasHeight;
        this.to.width = canvasWidth;
        this.to.height = canvasHeight;

        this.lines = []; this.line = null;

        this.isMouseDown = false;
        this.from.addEventListener('mousedown', this.updateMouseDown.bind(this));
        this.from.addEventListener('mouseup', this.updateMouseUp.bind(this));
        this.updateTimeout = null; this.updateFPS = 30;
        this.from.addEventListener('mousemove', this.updateThrottle.bind(this));
    }

    resizeThrottle() {
        if (!this.resizeTimeout) {
            const time = Math.round(1000 / this.resizeFPS)
            this.resizeTimeout = setTimeout(function () { this.resizeTimeout = null; this.resize(); }.bind(this), time);
        }
    }

    resize() {
        const ratio = 0.3;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const canvasWidth = Math.round(width * ratio);
        const canvasHeight = Math.round(height * ratio);
        console.log(width, height, canvasWidth, canvasHeight);
        this.from.width = canvasWidth;
        this.from.height = canvasHeight;
        this.to.width = canvasWidth;
        this.to.height = canvasHeight;
    }

    updateThrottle(event) {
        if (!this.updateTimeout) {
            console.log('update');
            const time = Math.round(1000 / this.updateFPS);
            this.updateTimeout = setTimeout(function () { this.updateTimeout = null; }.bind(this), time);
            this.updateCanvas(event);
        }
    }

    updateMouseDown(event) {
        console.log('down');
        this.isMouseDown = true;
        const pos = getPos(event);
        this.trans.drawPoint(pos);
        this.line = [pos];
    }

    updateMouseUp(event) {
        console.log('down');
        this.isMouseDown = false
        const pos = getPos(event);
        const lastPos = this.line[this.line.length - 1];
        if (JSON.stringify(lastPos) !== JSON.stringify(pos)) {
            this.line.push(pos);
            this.trans.drawLine(lastPos, pos)
        }
        this.trans.drawPoint(lastPos, pos);
        this.lines.push(this.line); this.line = null;
    }

    updateCanvas(event) {
        if (!this.isMouseDown) { return }
        const pos = getPos(event);
        if (this.line === null) {
            this.line = [];
            this.trans.drawPoint(pos);
        }
        else {
            const lastPos = this.line[this.line.length - 1];
            if (JSON.stringify(lastPos) === JSON.stringify(pos)) { return }
            this.trans.drawLine(lastPos, pos);
        }
        console.log('move', pos);
        this.line.push(pos);
    }
}

window.onload = () => new App();