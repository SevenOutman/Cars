/**
 * Created by Doma on 15/12/27.
 */
function InputManager() {
    this.events = {};
    if (window.navigator.msPointerEnabled) {
        //Internet Explorer 10 style
        this.eventTouchstart = "MSPointerDown";
    } else {
        this.eventTouchstart = "touchstart";
    }
    this.listen();
}

InputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

InputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            setTimeout(function () {
                callback(data);
            }, 0);
        });
    }
};

InputManager.prototype.listen = function () {
    var self = this;
    var canvas = document.getElementById("canvas");
    canvas.addEventListener(this.eventTouchstart, function (e) {
        self.canvasTouched(e);
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        self.canvasTouched(e);
    }, false);
    document.addEventListener("keydown", function (e) {
        e.preventDefault();
        switch (e.which) {
            case 65:
                self.emit("leftTouched");
                break;
            case 76:
                self.emit("rightTouched");
                break;
        }
    }, false);
};

InputManager.prototype.canvasTouched = function (e) {
    e.preventDefault();
    var center = window.innerWidth / 2;
    if (e.clientX < center) {
        this.emit("leftTouched");
    } else if (e.clientX > center) {
        this.emit("rightTouched");
    } else {
        this.emit(Math.random() < 0.5 ? "leftTouched" : "rightTouched");
    }
};