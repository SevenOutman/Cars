/**
 * Created by Doma on 16/1/13.
 */
function CollisionDetector() {
    this.canvas = document.createElement("canvas");
}

CollisionDetector.prototype.collisionTest = function (obj, car) {
    this.canvas.height = this.canvas.width = obj.r * 2;
    //document.body.appendChild(this.canvas);
    if (obj instanceof Circle) {
        return this.collisionTestCircle(obj, car);
    } else if (obj instanceof Square) {
        return this.collisionTestSquare(obj, car);
    }
    return false;
};

CollisionDetector.prototype.collisionTestCircle = function (circle, car) {
    var context = this.canvas.getContext("2d");
    context.save();

    context.translate(circle.r - circle.x, circle.r - circle.y);
    context.fillStyle = "red";
    context.beginPath();
    context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    context.save();
    context.translate(car.x, car.y);
    context.rotate(car.dir());
    context.globalCompositeOperation = "destination-in";
    Prerenderer.pathRoundRect(-car.w / 2, -car.h / 2, car.w, car.h, car.radius, context);
    context.fill();
    context.restore();
    var data = context.getImageData(0, 0, circle.r * 4, circle.r * 4).data;
    for (var i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
            context.restore();
            return true;
        }
    }
    context.restore();

    return false;
};

CollisionDetector.prototype.collisionTestSquare = function (square, car) {
    var context = this.canvas.getContext("2d");
    context.save();

    context.translate(square.r - square.x, square.r - square.y);
    context.fillStyle = "red";
    Prerenderer.pathRoundRect(square.x - square.r, square.y - square.r, square.size, square.size, square.radius, context);
    context.fill();

    context.save();
    context.translate(car.x, car.y);
    context.rotate(car.dir());
    context.globalCompositeOperation = "destination-in";
    Prerenderer.pathRoundRect(-car.w / 2, -car.h / 2, car.w, car.h, car.radius, context);
    context.fill();
    context.restore();
    var data = context.getImageData(0, 0, square.size * 2, square.size * 2).data;
    for (var i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
            context.restore();
            return true;
        }
    }
    context.restore();
    return false;
};