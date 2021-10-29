function identity(point) {
    return point
}

function mirror(point) {
    const [x, y] = point;
    return [-x, y]
}

function inverse(point) {
    const [x, y] = point;
    return [y, x]
}

function circularMirror(point) {
    const c = 10000;
    const [x, y] = point;
    const angle = Math.atan2(y, x);
    const r2 = x ** 2 + y ** 2;
    const invR = r2 ** (-0.5) || 0;
    const transX = c * Math.cos(angle) * invR;
    const transY = c * Math.sin(angle) * invR;
    return [transX, transY]
}

function circularMirror2(point) {
    const A = 100;
    const c = 500;
    const [x, y] = point;
    const angle = Math.atan2(y, x);
    const r = (x ** 2 + y ** 2) ** 0.5;
    const expR = Math.exp(-r / c);
    const transX = A * Math.cos(angle) * expR;
    const transY = A * Math.sin(angle) * expR;
    return [transX, transY]
}

function rotate(point) {
    const [x, y] = point;
    const r = (x ** 2 + y ** 2) ** 0.5;
    const angle = Math.atan2(y, x) + Math.PI / 3;
    const transX = Math.cos(angle) * r;
    const transY = Math.sin(angle) * r;
    return [transX, transY]
}

function sincos(point) {
    const A = 100;
    const T = 10;
    const [x, y] = point;
    return [x + A * Math.sin(y / T), y + A * Math.cos(x / T)]
}

function onlyX(point) {
    return [point[0], 0]
}

function lazer(point) {
    const T = 100;
    const [x, y] = point;
    return [x * Math.cos(y / T), y * Math.sin(x / T)]
}

function pole(point) {
    const [x, y] = point;
    return [x ** 0.5, y + 10 / y]
}

function hole(point) {
    const [x, y] = point;
    return [x, Math.exp(y/x)]
}

export const functionDict = new Map([
    ['Identity', identity],
    ['Inverse', inverse],
    ['Mirror', mirror],
    ['Rotate', rotate],
    ['Circular Mirror', circularMirror],
    ['Circular Mirror2', circularMirror2],
    ['Sine and Cosine', sincos],
    ["Only X", onlyX],
    ["Lazer", lazer],
    ["Pole", pole],
    ["Hole", hole]
]);