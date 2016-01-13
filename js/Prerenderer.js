/**
 * Created by Doma on 16/1/13.
 */
function Prerenderer(palette) {
    this.leftColor = palette.leftColor;
    this.rightColor = palette.rightColor;
}


Prerenderer.prototype.prerenderedCar = function (car) {
    var canvas = document.createElement("canvas");
    canvas.width = car.w * 2;
    canvas.height = car.h * 2;
    var context = canvas.getContext("2d");
    var x = 0,
        y = 0,
        w = car.w * 2,
        h = car.h * 2,
        r = car.radius * 2,
        color = car.leftSide ? this.leftColor : this.rightColor;
    Prerenderer.pathRoundRect(x, y, w, h, r, context);
    context.fillStyle = color;
    context.fill();

    var u = w / 8;
    x += u;
    y += u;
    h -= u * 2;
    w -= u * 2;
    Prerenderer.pathRoundRect(x, y, w, h, r, context);
    context.fillStyle = "#D6D7D6";
    context.fill();

    x += u;
    y = y + h / 16 * 7;
    w -= u * 2;
    h = w * Math.sqrt(3) / 2;

    var cx = x + w / 2,
        cy = y,
        ox = u + w / 2,
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
    context.fillStyle = "#25337A";
    context.fill();

    context.fillStyle = color;
    context.fillRect(x, y, w, h);
    return canvas;
};


Prerenderer.prototype.prerenderedCircle = function (circle) {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = circle.r * 4;
    circle.r *= 2;
    circle.x += circle.r;
    circle.y += circle.r;
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = circle.leftSide ? this.leftColor : this.rightColor;
    context.fill();

    context.beginPath();
    context.arc(circle.x, circle.y, circle.r * 5 / 8, 0, Math.PI * 2, true);
    context.closePath();

    context.strokeStyle = "#D6D7D6";
    context.lineWidth = circle.r / 4;
    context.stroke();
    return canvas;
};

Prerenderer.prototype.prerenderedSquare = function (square) {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = square.r * 4;
    square.size *= 2;
    square.r *= 2;
    square.x += square.r;
    square.y += square.r;
    var context = canvas.getContext("2d");
    var x = square.x - square.size / 2,
        y = square.y - square.size / 2,
        w = square.size,
        h = square.size,
        r = square.radius * 2;
    Prerenderer.pathRoundRect(x, y, w, h, r, context);

    context.fillStyle = square.leftSide ? this.leftColor : this.rightColor;
    context.fill();

    x = square.x - square.size / 16 * 5;
    y = square.y - square.size / 16 * 5;
    w = square.size / 8 * 5;
    h = square.size / 8 * 5;
    r = r / 3;
    Prerenderer.pathRoundRect(x, y, w, h, r, context);

    context.strokeStyle = "#D6D7D6";
    context.lineWidth = square.size / 8;
    context.stroke();
    return canvas;
};


Prerenderer.pathRoundRect = function (x, y, w, h, r, context) {
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
};
