/**
 * Created by Doma on 15/12/27.
 */

function Renderer() {
    var canvas = document.getElementById("canvas");
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
    this.context = canvas.getContext("2d");

    var bgcanvas = document.getElementById("bgcanvas");
    bgcanvas.width = this.width;
    bgcanvas.height = this.height;
    this.bgcontext = bgcanvas.getContext("2d");


    this.leftColor = "#F13A63";
    this.rightColor = "#01AAC2";
    this.prerenderer = new Prerenderer({
        leftColor: this.leftColor,
        rightColor: this.rightColor
    });

    this.laneWidth = this.width / 4 - 2;
    this.spriteWith = Math.round(this.laneWidth * 0.4);
    this.spriteHalfWith = Math.round(this.laneWidth * 0.2);
    this.laneCenters = [this.laneWidth / 2, this.laneWidth * 1.5 + 2, this.laneWidth * 2.5 + 6, this.laneWidth * 3.5 + 8];
    this.translation = 0;

    this.setup();
}

Renderer.prototype.setup = function () {
    this.drawRoad();
    this.prerenderSprites();
};

Renderer.prototype.prerenderSprites = function () {
    this.sprites = {};
    this.prerenderCars();
    this.prerenderObjects();
};

Renderer.prototype.prerenderCars = function () {
    var self = this;
    self.sprites.leftCar = this.prerenderer.prerenderedCar(new Car({
        x: 0,
        y: 0,
        w: self.spriteWith,
        leftSide: true
    }));
    self.sprites.rightCar = this.prerenderer.prerenderedCar(new Car({
        x: 0,
        y: 0,
        w: self.spriteWith
    }));
};

Renderer.prototype.prerenderObjects = function () {
    var self = this;
    self.sprites.leftCircle = self.prerenderer.prerenderedCircle(new Circle({
        x: 0,
        y: 0,
        r: self.spriteWith / 2,
        leftSide: true
    }));
    self.sprites.rightCircle = self.prerenderer.prerenderedCircle(new Circle({
        x: 0,
        y: 0,
        r: self.spriteWith / 2
    }));
    self.sprites.leftSquare = self.prerenderer.prerenderedSquare(new Square({
        x: 0,
        y: 0,
        r: self.spriteWith / 2,
        leftSide: true
    }));
    self.sprites.rightSquare = self.prerenderer.prerenderedSquare(new Square({
        x: 0,
        y: 0,
        r: self.spriteWith / 2
    }));
};

Renderer.prototype.render = function (gameData) {
    var self = this,
        context = self.context;
    requestAnimationFrame(function () {
        context.translate(0, gameData.moved - self.translation);
        self.translation = gameData.moved;
        self.clearCanvas();
        self.drawObjects(gameData.leftObjects.concat(gameData.rightObjects));
        self.drawCars([gameData.leftCar, gameData.rightCar]);
    });
};

Renderer.prototype.clearCanvas = function () {
    this.context.clearRect(0, -this.translation, this.width, this.height);
};

Renderer.prototype.drawRoad = function () {
    var context = this.bgcontext;
    context.fillStyle = "#25337A";
    context.fillRect(0, -this.translation, this.width, this.height);

    context.strokeStyle = "#8298F1";
    context.moveTo(this.width / 2 - 1, -this.translation);
    context.lineTo(this.width / 2 - 1, this.height - this.translation);

    context.moveTo(this.width / 2 + 1, -this.translation);
    context.lineTo(this.width / 2 + 1, this.height - this.translation);

    context.moveTo(this.width / 4 - 1, -this.translation);
    context.lineTo(this.width / 4 - 1, this.height - this.translation);

    context.moveTo(this.width / 4 * 3 + 1, -this.translation);
    context.lineTo(this.width / 4 * 3 + 1, this.height - this.translation);
    context.lineWidth = 2;
    context.stroke();
};

Renderer.prototype.drawObjects = function (objects) {
    for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        if (obj instanceof Circle) {
            this.drawCircle(obj);
        } else if (obj instanceof Square) {
            this.drawSquare(obj);
        }
    }
};

Renderer.prototype.drawCircle = function (circle) {
    var context = this.context;
    if (circle.leftSide) {
        context.drawImage(this.sprites.leftCircle, circle.x - circle.r, circle.y - circle.r, circle.r * 2, circle.r * 2);
    } else {
        context.drawImage(this.sprites.rightCircle, circle.x - circle.r, circle.y - circle.r, circle.r * 2, circle.r * 2);
    }
};
Renderer.prototype.drawSquare = function (square) {
    var context = this.context;
    if (square.leftSide) {
        context.drawImage(this.sprites.leftSquare, square.x - square.r, square.y - square.r, square.size, square.size);
    } else {
        context.drawImage(this.sprites.rightSquare, square.x - square.r, square.y - square.r, square.size, square.size);
    }
};

Renderer.prototype.drawCars = function (cars) {
    for (var i = 0; i < cars.length; i++) {
        this.drawCar(cars[i]);
    }
};

Renderer.prototype.drawCar = function (car) {
    var context = this.context;
    this.drawDusts(car.dusts);
    context.save();
    context.translate(car.x, car.y);
    context.rotate(car.dir());
    var x = -car.w / 2,
        y = -car.h / 2,
        w = car.w,
        h = car.h;
    if (car.leftSide) {
        context.drawImage(this.sprites.leftCar, x, y, w, h);
    } else {
        context.drawImage(this.sprites.rightCar, x, y, w, h);
    }
    context.restore();
};
Renderer.prototype.drawDusts = function (dusts) {
    this.context.fillStyle = "rgba(241, 58, 99, .6)";
    for (var i = 0; i < dusts.length; i++) {
        if (dusts[i].leftSide) {
            this.drawDust(dusts[i]);
        }
    }
    this.context.fillStyle = "rgba(1, 170, 194, .6)";
    for (var i = 0; i < dusts.length; i++) {
        if (!dusts[i].leftSide) {
            this.drawDust(dusts[i]);
        }
    }
};
Renderer.prototype.drawDust = function (dust) {
    var y = dust.y - dust.size / 2;
    if (y > this.height - this.translation) {
        dust.isOut = true;
    } else {
        //this.context.fillStyle = dust.color;
        this.context.fillRect(dust.x - dust.size / 2, y, dust.size, dust.size);
    }
};