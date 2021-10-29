const pointSize = 5;
const lineWidth = 3;

export function getPoint(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    return [x, y]
}

export function drawPoint(canvas, point, ) {
    const ctx = canvas.getContext('2d');
    const [x, y] = point;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
}

export function drawLine(canvas, point1, point2) {
    const ctx = canvas.getContext('2d');
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

export function clear(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}