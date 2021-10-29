import { drawPoint, drawLine } from "./drawUtil.js";

export class Transform {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    get t() {
        return Date.now()
    }

    setOrigin(origin) {
        const [x, y] = origin;
    }

    drawPoint(pos) {
        drawPoint(this.from, pos);
        const transPos = this.convert(pos);
        drawPoint(this.to, transPos);
    }

    drawLine(pos1, pos2) {
        drawLine(this.from, pos1, pos2);
        const transPos1 = this.convert(pos1);
        const transPos2 = this.convert(pos2);
        drawLine(this.to, transPos1, transPos2);
    }

    convert(pos) {
        // return this.inverse(pos)
        return this.circularMirror(pos)
        // return this.strange1(pos)
    }

    inverse(pos) {
        const [x, y] = pos;
        return [y, x]
    }

    circularMirror(pos) {
        const c = 100000;
        const [x, y] = pos;
        const angle = Math.atan2(y, x);
        const r2 = x ** 2 + y ** 2;
        const invR = r2 ** (-0.5);
        const transX = c * Math.cos(angle) * invR;
        const transY = c * Math.sin(angle) * invR;
        return [transX, transY]
    }

    strange1(pos) {
        const A = 100;
        const f = 10;
        const [x, y] = pos;
        return [x, y + A * Math.cos(f * x)]
    }
}