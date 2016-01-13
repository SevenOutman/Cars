/**
 * Created by Doma on 16/1/12.
 */
function getRedina(x1, y1, x2, y2) {
    // 直角的边长
    var x = x1 - x2; //Math.abs(x1 - x2);
    var y = y1 - y2; //Math.abs(y1 - y2);
    // 斜边长
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // 余弦
    var cos = y / z;
    // 弧度
    return Math.acos(cos) * (x * y >= 0 ? -1 : 1);
}
function getAngle(x1, y1, x2, y2) {
    return 180 / (Math.PI / getRedina(x1, y1, x2, y2));
}
function Car(config) {
    this.x = config.x;
    this.y = config.y;
    this.w = config.w;
    this.h = this.w * 2;
    this.radius = this.w / 3.5;
    this.leftSide = config.leftSide || false;

    this.speed = 0;

    this.frontAnchor = this.rearAnchor = this.x;
    this.dest = this.x;
    this.isSwitching = false;
    this.vx = this.w / 4;

    this.dusts = [];
    this.timegap = 5;
}
Car.prototype.update = function (forward) {
    this.speed = forward;
    this.y -= this.speed;
    if (this.isSwitching) {
        if (this.dest > this.rearAnchor) {
            this.moveRight();
        } else {
            this.moveLeft();
        }
        if (this.x == this.dest) {
            this.isSwitching = false;
        }
    }
    var dusts = this.dusts;
    while (dusts.length && (dusts[0].size <= 0 || dusts[0].isOut)) {
        dusts.shift();
    }
    for (var i = 0; i < dusts.length; i++) {
        dusts[i].update(forward - 1);
    }
    if (--this.timegap == 0) {
        this.discharge();
    }
};
Car.prototype.switch = function (dest) {
    this.dest = dest;
    this.isSwitching = true;
};
Car.prototype.moveRight = function () {
    if (this.frontAnchor - this.rearAnchor >= this.w || this.frontAnchor == this.dest) {
        this.rearAnchor = Math.min(this.dest, this.rearAnchor + this.vx);
    }
    this.frontAnchor = Math.min(this.dest, this.frontAnchor + this.vx);
    this.x = (this.frontAnchor + this.rearAnchor) / 2;
};
Car.prototype.moveLeft = function () {
    if (this.rearAnchor - this.frontAnchor >= this.w || this.frontAnchor == this.dest) {
        this.rearAnchor = Math.max(this.dest, this.rearAnchor - this.vx);
    }
    this.frontAnchor = Math.max(this.dest, this.frontAnchor - this.vx);
    this.x = (this.frontAnchor + this.rearAnchor) / 2;
};
Car.prototype.dir = function () {
    return Math.asin((this.frontAnchor - this.rearAnchor) / this.h);
};

Car.prototype.discharge = function () {
    var self = this;
    this.dusts.push(new Dust({
        x: self.rearAnchor,
        y: self.y + self.h / 2,
        vx: 0.2 - Math.random() * 0.4,
        vy: self.speed,
        ax: 0,
        ay: 0.05,
        leftSide: self.leftSide
    }));
    this.timegap = 5;
};

function Circle(config) {
    this.x = config.x;
    this.y = config.y;
    this.r = config.r;
    this.color = config.color;
    this.leftSide = config.leftSide || false;
}
function Square(config) {
    this.x = config.x;
    this.y = config.y;
    this.r = config.r;
    this.size = this.r * 2;
    this.radius = this.size / 16 * 3;
    this.color = config.color;
    this.leftSide = config.leftSide || false;
}
function Dust(config) {
    this.x = config.x;
    this.y = config.y;
    this.size = Math.random() * 2 + 7;
    this.vx = config.vx;
    this.vy = config.vy;
    this.ax = config.ax;
    this.ay = config.ay;
    this.leftSide = config.leftSide;
    this.color = this.leftSide ? "rgba(241, 58, 99, .6)" : "rgba(1, 170, 194, .6)";
}
Dust.prototype.update = function () {
    this.x += this.vx;
    this.y -= this.vy;
    this.vx += this.ax;
    this.vy = Math.max(0, this.vy - this.ay);
    this.size = this.size < 1 ? 0 : this.size * 0.99;
    this.isOut = false;
};