/**
 * Created by Doma on 15/12/27.
 */
function Game() {
    this.inputManager = new InputManager();
    this.renderer = new Renderer();
    this.collisionDetector = new CollisionDetector();

    this.onload = true;
    this.gameState = Game.States.Starting;

    this.initConfig();
    this.initEvents();
    this.newGame();

    var self = this;
    requestAnimationFrame(function () {
        self.nextFrame();
    });
    //if (this.collisionDetector.collisionTest(new Circle({
    //        x: this.config.laneCenters[0],
    //        y: this.gameData.leftCar.y - 40,
    //        r: this.config.spriteWith / 2,
    //        color: this.config.leftColor,
    //        leftSide: true
    //    }), this.gameData.leftCar)) {
    //    console.log("collide");
    //}
    this.start();
}
Game.States = {
    Over: -1,
    Starting: 0,
    Playing: 1
};


Game.prototype.initConfig = function () {
    var self = this;
    self.config = {
        bottom: self.renderer.height,
        laneWidth: self.renderer.laneWidth,
        laneCenters: self.renderer.laneCenters,
        initialSpeed: 5,
        leftColor: "#F13A63",
        rightColor: "#01AAC2",
        spriteWith: self.renderer.spriteHalfWith * 2
    };
};

Game.prototype.initEvents = function () {
    var self = this;
    self.inputManager.on("leftTouched", function () {
        self.switchCar("left");
    });
    self.inputManager.on("rightTouched", function () {
        self.switchCar("right");
    });
};

Game.prototype.switchCar = function (side) {
    if (this.isPlaying()) {
        var self = this,
            leftCar = self.gameData.leftCar,
            rightCar = self.gameData.rightCar,
            laneCenters = self.config.laneCenters;
        if (side == "left") {
            if (leftCar.dest == laneCenters[0]) {
                leftCar.switch(laneCenters[1]);
            } else if (leftCar.dest == laneCenters[1]) {
                leftCar.switch(laneCenters[0]);
            }
        } else if (side == "right") {

            if (rightCar.dest == laneCenters[2]) {
                rightCar.switch(laneCenters[3]);
            } else if (rightCar.dest == laneCenters[3]) {
                rightCar.switch(laneCenters[2]);
            }
        }

    }
};

Game.prototype.newGame = function () {
    this.gameState = Game.States.Starting;
    this.resetGameData();
};

Game.prototype.resetGameData = function () {
    var self = this,
        config = self.config;
    self.gameData = {
        moved: 0,
        speed: config.initialSpeed,
        leftCar: new Car({
            x: config.laneCenters[0],
            y: config.bottom - config.spriteWith * 3,
            w: config.spriteWith,
            color: config.leftColor,
            leftSide: true
        }),
        rightCar: new Car({
            x: config.laneCenters[3],
            y: config.bottom - config.spriteWith * 3,
            w: config.spriteWith,
            color: config.rightColor
        }),
        leftObjects: [],
        rightObjects: [],
        safedistance: config.laneWidth * 3,
        after: Math.floor(Math.random() * config.spriteWith + config.spriteWith) * 2,
        skipLeft: 0,
        skipRight: 0,
        leftFirst: !(Math.random() < 0.5)
    };
};


Game.prototype.start = function () {
    this.gameState = Game.States.Playing;
};
Game.prototype.isPlaying = function () {
    return this.gameState == Game.States.Playing;
};
Game.prototype.nextFrame = function () {
    var self = this;
    self.renderer.render(self.gameData);
    self.updateGameData();
    requestAnimationFrame(function () {
        self.nextFrame();
    });
};

Game.prototype.updateGameData = function () {
    var gameData = this.gameData,
        config = this.config,
        forward = 0;
    if (this.isPlaying()) {
        forward = gameData.speed;
        gameData.moved += forward;

        gameData.leftCar.update(forward);
        gameData.rightCar.update(forward);
    }


    gameData.skipLeft -= forward;

    if (this.isPlaying()) {
        var leftObjects = gameData.leftObjects,
            rightObjects = gameData.rightObjects;
        while (leftObjects.length && leftObjects[0].y - leftObjects[0].r > config.bottom - gameData.moved) {
            leftObjects.shift();
        }
        while (rightObjects.length && rightObjects[0].y - rightObjects[0].r > gameData.moved) {
            rightObjects.shift();
        }
        var leftCar = gameData.leftCar,
            rightCar = gameData.rightCar,
            carDanger = Math.sqrt(5) * leftCar.w / 2;
        for (var i = 0; i < leftObjects.length; i++) {
            var obj = leftObjects[i];
            if (obj.y + obj.r < leftCar.y - carDanger) {
                break;
            }
            if (obj.y - obj.r <= leftCar.y + carDanger) {
                if (this.collisionDetector.collisionTest(obj, leftCar)) {
                    this.gameover();
                    return;
                }
                break;
            }
        }
        for (var i = 0; i < rightObjects.length; i++) {
            var obj = rightObjects[i];
            if (obj.y + obj.r < rightCar.y - carDanger) {
                break;
            }
            if (obj.y - obj.r <= rightCar.y + carDanger) {
                if (this.collisionDetector.collisionTest(obj, rightCar)) {
                    this.gameover();
                    return;
                }
                break;
            }
        }
        if (gameData.skipLeft <= 0) {
            var lefty, righty,
                leftx = this.random([config.laneCenters[0], config.laneCenters[1]]),
                rightx = this.random([config.laneCenters[2], config.laneCenters[3]]),
                leftSprite = this.random([Circle, Square]),
                rightSprite = this.random([Circle, Square]),
                spriteRadius = config.spriteWith / 2;
            if (gameData.leftFirst) {
                lefty = -gameData.moved - spriteRadius;
                righty = lefty - gameData.after;
            } else {
                righty = -gameData.moved - spriteRadius;
                lefty = righty - gameData.after;
            }

            leftObjects.push(new leftSprite({
                x: leftx,
                y: lefty,
                r: spriteRadius,
                color: config.leftColor,
                leftSide: true
            }));
            rightObjects.push(new rightSprite({
                x: rightx,
                y: righty,
                r: spriteRadius,
                color: config.rightColor
            }));
            gameData.skipLeft = gameData.safedistance;
        }
    }
};

Game.prototype.gameover = function () {
    this.gameState = Game.States.Over;
};

Game.prototype.random = function (range) {
    var rand = Math.random(),
        len = range.length;
    for (var i = 1; i < len; i++) {
        if (rand < i / len) {
            return range[i - 1];
        }
    }
    return range[len - 1];
};