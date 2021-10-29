import { drawPoint, drawLine } from "./drawUtil.js";

export class Transform {
    constructor() {
        this.from = document.getElementById('from');
        this.to = document.getElementById('to');
        this.conv = (pos) => { return pos };
    }

    get t() {
        return Date.now()
    }

    set origin(ori) {
        this.ori = ori;
    }

    set func(func) {
        this.conv = func;
    }

    drawPoint(point, from = true, to = true) {
        if (from) {
            drawPoint(this.from, point);
        }
        if (to) {
            const transPoint = this.convert(point);
            drawPoint(this.to, transPoint);
            return transPoint
        }
    }

    drawLine(point1, point2, from = true, to = true) {
        if (from) {
            drawLine(this.from, point1, point2);
        }
        if (to) {
            const transPoint1 = this.convert(point1);
            const transPoint2 = this.convert(point2);
            drawLine(this.to, transPoint1, transPoint2);
            return [transPoint1, transPoint2]
        }
    }

    convert(point) {
        const [x, y] = point;
        const [oX, oY] = this.ori;
        const dPoint = [x - oX, y - oY];
        const [convX, convY] = this.conv(dPoint);
        return [convX + oX, convY + oY]
    }
}