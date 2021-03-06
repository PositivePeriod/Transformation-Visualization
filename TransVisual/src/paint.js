import { Transform } from "./transform.js";
import { clear } from "./drawUtil.js";
import { Throttle } from "./throttle.js";
import { functionDict } from "./function.js";

export class Paint {
    constructor() {
        this.trans = new Transform();
        this.trans.origin = [0, 0];
        this.funcName = 'Identity';

        this.canPaint = false;
        this.lines = []; this.line = null;
        this.moveThrottle = new Throttle(50);
        this.undoThrottle = new Throttle(5);
    }

    set funcName(funcName) {
        if (functionDict.has(funcName)) { this.trans.func = functionDict.get(funcName) };
    }

    drawStart(point, from, to) {
        if (this.canPaint) { return }
        this.canPaint = true;
        const convPoint = this.trans.drawPoint(point, from, to);
        this.line = [point];
        return convPoint
    }

    drawMove(point, from, to) {
        return this.moveThrottle.run(this.draw.bind(this, point, from, to));
    }

    draw(point, from, to) {
        if (!this.canPaint) { return }
        const lastPoint = this.line[this.line.length - 1];
        if (JSON.stringify(lastPoint) === JSON.stringify(point)) { return }
        const convPoints = this.trans.drawLine(lastPoint, point, from, to);
        const convPoint = convPoints ? convPoints[1] : undefined; // convPoints = [convLastPoint, convPoint]
        this.line.push(point);
        return convPoint
    }

    drawEnd(point, save = true, from, to) {
        if (!this.canPaint) { return }
        this.canPaint = false
        const lastPoint = this.line[this.line.length - 1];
        if (JSON.stringify(lastPoint) !== JSON.stringify(point)) {
            this.line.push(point);
            this.trans.drawLine(lastPoint, point, from, to)
        }
        const convPoint = this.trans.drawPoint(point, from, to);
        if (save) { this.lines.push(this.line); } this.line = null;
        return convPoint
    }

    drawForceToEnd() {
        if (!this.canPaint) { return }
        this.canPaint = false
        const lastPoint = this.line[this.line.length - 1];
        const convPoint = this.trans.drawPoint(lastPoint);
        this.lines.push(this.line); this.line = null;
        return convPoint
    }

    undo() {
        this.undoThrottle.run(function () {
            this.drawForceToEnd();
            this.lines.pop();
            this.redraw();
        }.bind(this));
    }

    redraw(from, to) {
        if (from) { clear(document.getElementById('from')); }
        if (to) { clear(document.getElementById('to')); }
        console.log(this.lines.length);
        this.lines.forEach(line => {
            if (line.length === 1) {
                var [x, y, opt] = line[0]; // TODO dirty code
                this.trans.drawPoint([x, y], from, to, opt);
            } else {
                this.drawStart(line[0], from, to);
                for (let i = 0; i < line.length - 1; i++) { this.draw(line[i], from, to); }
                this.drawEnd(line[line.length - 1], false, from, to);
            }
        })

    }
}