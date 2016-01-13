/**
 * Created by Doma on 15/12/28.
 */

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

Function.prototype.bind = Function.prototype.bind || function (target) {
        var self = this;
        return function (args) {
            if (!(args instanceof Array)) {
                args = [args];
            }
            self.apply(target, args);
        };
    };

(function () {
    if (typeof window.Element === "undefined" ||
        "classList" in document.documentElement) {
        return;
    }

    var prototype = Array.prototype,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
        this.el = el;
        // The className needs to be trimmed and split on whitespace
        // to retrieve a list of classes.
        var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
            push.call(this, classes[i]);
        }
    }

    DOMTokenList.prototype = {
        add: function (token) {
            if (this.contains(token)) {
                return;
            }
            push.call(this, token);
            this.el.className = this.toString();
        },
        contains: function (token) {
            return this.el.className.indexOf(token) != -1;
        },
        item: function (index) {
            return this[index] || null;
        },
        remove: function (token) {
            if (!this.contains(token)) {
                return;
            }
            for (var i = 0; i < this.length; i++) {
                if (this[i] == token) {
                    break;
                }
            }
            splice.call(this, i, 1);
            this.el.className = this.toString();
        },
        toString: function () {
            return join.call(this, ' ');
        },
        toggle: function (token) {
            if (!this.contains(token)) {
                this.add(token);
            } else {
                this.remove(token);
            }

            return this.contains(token);
        }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter(obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop, {
                get: getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(HTMLElement.prototype, 'classList', function () {
        return new DOMTokenList(this);
    });
})();

(function (prototype) {

    var pixelRatio = (function (context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        })(prototype),

        forEach = function (obj, func) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    func(obj[p], p);
                }
            }
        },

        ratioArgs = {
            'fillRect': 'all',
            'clearRect': 'all',
            'strokeRect': 'all',
            'moveTo': 'all',
            'lineTo': 'all',
            'arc': [0, 1, 2],
            'arcTo': 'all',
            'bezierCurveTo': 'all',
            'isPointinPath': 'all',
            'isPointinStroke': 'all',
            'quadraticCurveTo': 'all',
            'rect': 'all',
            'translate': 'all',
            'createRadialGradient': 'all',
            'createLinearGradient': 'all'
        };

    if (pixelRatio === 1) return;

    forEach(ratioArgs, function (value, key) {
        prototype[key] = (function (_super) {
            return function () {
                var i, len,
                    args = Array.prototype.slice.call(arguments);

                if (value === 'all') {
                    args = args.map(function (a) {
                        return a * pixelRatio;
                    });
                }
                else if (Array.isArray(value)) {
                    for (i = 0, len = value.length; i < len; i++) {
                        args[value[i]] *= pixelRatio;
                    }
                }

                return _super.apply(this, args);
            };
        })(prototype[key]);
    });

    // Stroke lineWidth adjustment
    prototype.stroke = (function (_super) {
        return function () {
            this.lineWidth *= pixelRatio;
            _super.apply(this, arguments);
            this.lineWidth /= pixelRatio;
        };
    })(prototype.stroke);

    // Text
    //
    prototype.fillText = (function (_super) {
        return function () {
            var args = Array.prototype.slice.call(arguments);

            args[1] *= pixelRatio; // x
            args[2] *= pixelRatio; // y

            this.font = this.font.replace(
                /(\d+)(px|em|rem|pt)/g,
                function (w, m, u) {
                    return (m * pixelRatio) + u;
                }
            );

            _super.apply(this, args);

            this.font = this.font.replace(
                /(\d+)(px|em|rem|pt)/g,
                function (w, m, u) {
                    return (m / pixelRatio) + u;
                }
            );
        };
    })(prototype.fillText);

    prototype.strokeText = (function (_super) {
        return function () {
            var args = Array.prototype.slice.call(arguments);

            args[1] *= pixelRatio; // x
            args[2] *= pixelRatio; // y

            this.font = this.font.replace(
                /(\d+)(px|em|rem|pt)/g,
                function (w, m, u) {
                    return (m * pixelRatio) + u;
                }
            );

            _super.apply(this, args);

            this.font = this.font.replace(
                /(\d+)(px|em|rem|pt)/g,
                function (w, m, u) {
                    return (m / pixelRatio) + u;
                }
            );
        };
    })(prototype.strokeText);


    prototype.drawImage = (function (_super) {
        return function () {
            var args = Array.prototype.slice.call(arguments);

            args[1] *= pixelRatio; // x
            args[2] *= pixelRatio; // y

            args[3] = args[3] ? args[3] * 2 : args[0].width;
            args[4] = args[4] ? args[4] * 2 : args[0].height;
            //args[3] *= pixelRatio; // w
            //args[4] *= pixelRatio; // h

            _super.apply(this, args);
        };

    })(prototype.drawImage);
})(CanvasRenderingContext2D.prototype);
;(function (prototype) {
    prototype.getContext = (function (_super) {
        return function (type) {
            var backingStore, ratio,
                context = _super.call(this, type);

            if (type === '2d') {

                backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;

                ratio = (window.devicePixelRatio || 1) / backingStore;

                if (ratio > 1) {
                    this.style.height = this.height + 'px';
                    this.style.width = this.width + 'px';
                    this.width *= ratio;
                    this.height *= ratio;
                }
            }

            return context;
        };
    })(prototype.getContext);
})(HTMLCanvasElement.prototype);
