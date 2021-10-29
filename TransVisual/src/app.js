import { drawPoint, getPoint, hsla } from "./drawUtil.js";
import { functionDict } from "./function.js";
import { Paint } from "./paint.js";
import { Throttle } from "./throttle.js";


class App {
    constructor() {
        this.from = document.getElementById('from');
        this.to = document.getElementById('to');

        this.paint = new Paint();

        this.fixOrigin = document.getElementById('fixOrigin');
        this.fixOrigin.addEventListener('change', this.resize.bind(this));

        this.resizeThrottle = new Throttle(30, false);
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        this.clickDrawAccuracy = 0.3; // Real number between 0 < <= 1 
        this.mode = 'buttonDraw';
        this.from.addEventListener('mousedown', this.mouseDown.bind(this));
        this.from.addEventListener('mousemove', this.mouseMove.bind(this));
        this.from.addEventListener('mouseup', this.mouseUp.bind(this));
        this.from.addEventListener('click', this.leftClick.bind(this));
        this.from.addEventListener('contextmenu', this.rightClick.bind(this)); // for preventDefault
        document.getElementById('drawOption').addEventListener('change', (event) => {
            this.paint.drawForceToEnd(); this.mode = event.target.value;
        });
        const transOption = document.getElementById('transOption');
        functionDict.forEach((func, funcName) => {
            const opt = document.createElement('option');
            [opt.value, opt.innerHTML] = [funcName, funcName];
            transOption.appendChild(opt);
        })
        transOption.addEventListener('change', function (event) {
            this.paint.drawForceToEnd(); this.paint.funcName = event.target.value; this.paint.redraw(false, true);
        }.bind(this));
        document.getElementById('undo').addEventListener('click', this.paint.undo.bind(this.paint))
        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 'z') { this.paint.undo(); }
        }.bind(this));

        this.defaultPoint();
    }

    defaultLine() {
        const [x0, y0] = this.paint.trans.origin;
        const convert = ([x, y]) => [x + x0, y + y0]
        const gridSize = 50;
        const num = 20
        const length = 1000
        const accuray = 0.3
        for (let i = -num; i < num + 1; i++) {
            let [x1, y1] = convert([gridSize * i, -length / 2]);
            let [x2, y2] = convert([gridSize * i, length / 2]);
            let r = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
            let n = Math.round(r * accuray);
            this.paint.drawStart([x1, y1]);
            [...Array(n).keys()]
                .map(i => [x1 * (n - i - 1) / n + x2 * (i + 1) / n, y1 * (n - i - 1) / n + y2 * (i + 1) / n])
                .forEach(pt => { this.paint.draw(pt); });
            this.paint.drawEnd([x2, y2]);
        }
        for (let i = -num; i < num + 1; i++) {
            let [x1, y1] = convert([-length / 2, gridSize * i]);
            let [x2, y2] = convert([length / 2, gridSize * i]);
            let r = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
            let n = Math.round(r * accuray);
            this.paint.drawStart([x1, y1]);
            [...Array(n).keys()]
                .map(i => [x1 * (n - i - 1) / n + x2 * (i + 1) / n, y1 * (n - i - 1) / n + y2 * (i + 1) / n])
                .forEach(pt => { this.paint.draw(pt); });
            this.paint.drawEnd([x2, y2]);
        }
    }

    defaultPoint() {
        const [x0, y0] = this.paint.trans.origin;
        const convert = ([x, y]) => [x + x0, y + y0]
        const gridSize = 4;
        const num = 100
        for (let i = -num; i < num + 1; i++) {
            for (let j = -num; j < num + 1; j++) {
                let point = convert([gridSize * i, gridSize * j]);
                let h = (i*2+j*3)*2 % 360
                let opt = { color: hsla(h, 100, 50, 0.1), size: 3 };
                this.paint.trans.drawPoint(point, true, true, opt);
                var [x,y] = point;
                this.paint.lines.push([[x,y,opt]]);
            }
        }
    }

    mouseDown(event) {
        const point = getPoint(event);
        let convPoint;
        switch (this.mode) {
            case 'buttonDraw':
                convPoint = this.paint.drawStart(point);
                this.log('MouseDown', point, convPoint);
                break;
        }
    }

    mouseMove(event) {
        const point = getPoint(event);
        let convPoint;
        switch (this.mode) {
            case 'buttonDraw':
            case 'toggleDraw':
                convPoint = this.paint.drawMove(point);
                this.log('MouseMove', point, convPoint);
                break;
        }
    }

    mouseUp(event) {
        const point = getPoint(event);
        let convPoint;
        switch (this.mode) {
            case 'buttonDraw':
                convPoint = this.paint.drawEnd(point);
                this.log('MouseUp', point, convPoint);
                break;
        }
    }

    leftClick(event) {
        const point = getPoint(event);
        let convPoint;
        switch (this.mode) {
            case 'toggleDraw':
                convPoint = !this.paint.canPaint ? this.paint.drawStart(point) : this.paint.drawEnd(point);
                this.log('LeftClick', point, convPoint);
                break;
            case 'clickDrawPoint':
                if (!this.paint.canPaint) {
                    convPoint = this.paint.drawStart(point);
                    this.log('LeftClick', point, convPoint);
                } else {
                    convPoint = this.paint.drawMove(point);
                    this.log('LeftClick', point, convPoint);
                }
                break;
            case 'clickDrawLine':
                if (!this.paint.canPaint) {
                    convPoint = this.paint.drawStart(point);
                    this.log('LeftClick', point, convPoint);
                } else {
                    let [x1, y1] = this.paint.line[this.paint.line.length - 1]; // lastPoint
                    let [x2, y2] = point;
                    let r = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
                    let n = Math.round(r * this.clickDrawAccuracy);
                    [...Array(n).keys()]
                        .map(i => [x1 * (n - i - 1) / n + x2 * (i + 1) / n, y1 * (n - i - 1) / n + y2 * (i + 1) / n])
                        .forEach(pt => { this.paint.draw(pt); })
                    this.log('LeftClick', point, this.paint.trans.convert(point));
                }
                break;
        }
    }

    rightClick(event) {
        event.preventDefault();
        const point = getPoint(event);
        let convPoint;
        switch (this.mode) {
            case 'clickDrawPoint':
            case 'clickDrawLine':
                if (this.paint.canPaint) {
                    let lastPoint = this.paint.line[this.paint.line.length - 1];
                    convPoint = this.paint.drawEnd(lastPoint);
                    this.log('RightClick', point, convPoint);
                }
                break;
        }
    }

    resizeThrottle() {
        if (!this.resizeTimeout) {
            const time = Math.round(1000 / this.resizeFPS);
            this.resizeTimeout = setTimeout(function () { this.resizeTimeout = null; this.resize(); }.bind(this), time);
        }
    }

    resize() {
        const ratio = 0.4;
        const size = Math.max(Math.round(window.innerWidth * ratio), Math.round(window.innerHeight * ratio))
        const canvasSize = [size, size];
        [this.from.width, this.from.height] = canvasSize;
        [this.to.width, this.to.height] = canvasSize;
        if (this.fixOrigin.checked) { this.paint.trans.origin = [canvasSize[0] / 2, canvasSize[1] / 2]; }
        this.paint.drawForceToEnd();
        this.paint.redraw();
    }

    log(name, point, convPoint) {
        // if (convPoint) { console.log(`${name} : ${point} -> ${convPoint.map(x => Math.round(x))}`); }
    }
}

window.onload = () => new App();