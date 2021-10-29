const pointSize = 5;
const lineWidth = 3;

export function getPos(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    return [x, y]
}

export function drawPoint(canvas, pos) {
    const ctx = canvas.getContext('2d');
    const [x, y] = pos;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
}

export function drawLine(canvas, pos1, pos2) {
    const ctx = canvas.getContext('2d');
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}