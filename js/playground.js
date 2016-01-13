/**
 * Created by Doma on 15/12/27.
 */
var canvas = document.getElementById("canvas"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    context = canvas.getContext("2d");

function Renderer() {
    this.width = width;
    this.height = height;
    this.context = context;

    this.laneWidth = this.width / 4 - 2;
    this.laneCenters = [this.laneWidth / 2, this.laneWidth * 1.5 + 2, this.laneWidth * 2.5 + 6, this.laneWidth * 3.5 + 8];
}

Renderer.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

Renderer.prototype.drawRoad = function () {
    var context = this.context;
    context.fillStyle = "#25337A";
    context.fillRect(0, 0, this.width, this.height);

    context.strokeStyle = "#8298F1";
    context.moveTo(this.width / 2, 0);
    context.lineTo(this.width / 2, this.height);
    context.lineWidth = 4;
    context.stroke();

    context.moveTo(this.width / 4 - 1, 0);
    context.lineTo(this.width / 4 - 1, this.height);
    context.lineWidth = 2;
    context.stroke();

    context.moveTo(this.width / 4 * 3 + 1, 0);
    context.lineTo(this.width / 4 * 3 + 1, this.height);
    context.lineWidth = 2;
    context.stroke();
};

Renderer.prototype.drawCircle = function (circle) {
    var context = this.context;
    context.beginPath();
    context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = circle.color;
    context.fill();

    context.beginPath();
    context.arc(circle.x, circle.y, circle.r * 5 / 8, 0, Math.PI * 2, true);
    context.closePath();

    context.strokeStyle = "#D6D7D6";
    context.lineWidth = circle.r / 4;
    context.stroke();
};
Renderer.prototype.drawSquare = function (square) {
    var context = this.context;
    var x = square.x - square.size / 2,
        y = square.y - square.size / 2,
        w = square.size,
        h = square.size,
        r = square.radius;
    this.pathRoundRect(x, y, w, h, r);

    context.fillStyle = square.color;
    context.fill();

    x = square.x - square.size / 16 * 5;
    y = square.y - square.size / 16 * 5;
    w = square.size / 8 * 5;
    h = square.size / 8 * 5;
    r = r / 3;
    this.pathRoundRect(x, y, w, h, r);

    context.strokeStyle = "#D6D7D6";
    context.lineWidth = square.size / 8;
    context.stroke();
};

Renderer.prototype.pathRoundRect = function (x, y, w, h, r) {
    var context = this.context;
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
};

Renderer.prototype.drawCar = function (car) {
    var x = car.x - car.w / 2,
        y = car.y - car.h / 2,
        w = car.w,
        h = car.h,
        r = car.radius;
    this.pathRoundRect(x, y, w, h, r);
    context.fillStyle = car.color;
    context.fill();

    x += 5;
    y += 5;
    w -= 10;
    h -= 10;
    this.pathRoundRect(x, y, w, h, r);
    context.fillStyle = "#D6D7D6";
    context.fill();

    x += 5;
    y = y + h / 16 * 7;
    w -= 10;
    h = w * Math.sqrt(3) / 2;

    var cx = x + w / 2,
        cy = y,
        ox = 5 + w / 2,
        cr = ox * 2;

    context.beginPath();
    context.arc(cx, cy, cr, Math.PI * 2 / 3, Math.PI / 3, true);
    context.lineTo(cx, cy);
    context.closePath();
    context.fillStyle = "#25337A";
    context.fill();

    cy = cy + h;

    context.beginPath();
    context.arc(cx, cy, cr, Math.PI * 4 / 3, Math.PI * 5 / 3, false);
    context.lineTo(cx, cy);
    context.closePath();
    context.fill();

    context.fillStyle = car.color;
    context.fillRect(x, y, w, h);
};


var renderer = new Renderer();
renderer.drawRoad();
renderer.drawCircle({
    x: 50,
    y: 100,
    r: 20,
    color: "#F13A63"
});
renderer.drawSquare({
    x: renderer.laneCenters[3],
    y: 100,
    size: 40,
    radius: 7.5,
    color: "#F13A63"
});
renderer.drawCar({
    x: renderer.laneCenters[3],
    y: 400,
    w: 40,
    h: 80,
    radius: 10,
    color: "#01AAC2"
});