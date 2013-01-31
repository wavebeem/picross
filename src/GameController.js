var GameController = (function() {
function GameController(opts) {
    this.init(opts);
}

var bindHandler = function(context, element, name) {
    element.on(name, function(event) {
        context[name](event);
    });
};

var K = {
    I: 73,
    O: 79,
    P: 80,

    UP:      38,
    DOWN:    40,
    LEFT:    37,
    RIGHT:   39,

    SPACE:   32,

    Z:  90,
    U:  85,
};

var mungeKeymap = function(keymapName) {
    var pairs = _.pairs(this[keymapName]);
    var map   = {};
    this[keymapName] = map;
    _.each(pairs, function(pair) {
        var a = pair[0];
        var b = pair[1];
        // console.log(a, b);
        map[K[a]] = b;
    });
}

_.extend(GameController.prototype, {
    buttonDownMap: {
        1: function() { this.startMode('filled') },
        3: function() { this.startMode('marked') },
    },
    buttonUpMap: {
        1: function() { this.startMode('empty') },
        3: function() { this.startMode('empty') },
    },
    keyDownMap: {
        I: function() { this.view.resetTileSize() },
        O: function() { this.view.shrink() },
        P: function() { this.view.grow() },

        UP:    function() { this.walkDirection('up') },
        DOWN:  function() { this.walkDirection('down') },
        LEFT:  function() { this.walkDirection('left') },
        RIGHT: function() { this.walkDirection('right') },

        Z:     function() { this.startMode('marked') },
        SPACE: function() { this.startMode('filled') },

        U:     function() { this.model.undo() },
    },
    keyUpMap: {
        Z:     function() { this.startMode('empty') },
        SPACE: function() { this.startMode('empty') },
    },
    repeatInterval: 100,
    repeatDelay: 300,
    init: function(opts) {
        _.extend(this, opts);

        var self = this;

        self.intervals = {};
        self.timeouts  = {};

        mungeKeymap.call(self, 'keyDownMap');
        mungeKeymap.call(self, 'keyUpMap');

        self.keysHeld = {};

        var $canvas   = $('#game');
        var $document = $(document);

        _([
            'mousemove',
            'mousedown',
        ]).each(function(name) {
            bindHandler(self, $canvas, name);
        });

        _([
            'contextmenu',
            'mouseup',
            'keydown',
            'keyup',
        ]).each(function(name) {
            bindHandler(self, $document, name);
        });
    },
    startMode: function(mode) {
        if (mode !== 'empty') {
            this.model.pushUndoHistory();
        }

        this.model.startMode(mode);
    },
    walkTo: function(x, y) {
        var self = this;
        var mx = self.model.x;
        var my = self.model.y;
        var dx = x - mx;
        var dy = y - my;
        var nx = Math.abs(dx);
        var ny = Math.abs(dy);
        var sx = dx < 0 ? 'left' : 'right';
        var sy = dy < 0 ? 'up'   : 'down';

        _(nx).times(function() { self.model.moveDirection(sx); });
        _(ny).times(function() { self.model.moveDirection(sy); });
    },
    walkDirection: function(dir) {
        var x = this.model.x;
        var y = this.model.y;

        var offsets = {
            'up':    [x + 0, y - 1],
            'down':  [x + 0, y + 1],
            'left':  [x - 1, y + 0],
            'right': [x + 1, y + 0],
        };

        this.walkTo.apply(this, offsets[dir]);
    },
    isArrowKey: function(k) {
        return (
               k === K.UP
            || k === K.DOWN
            || k === K.LEFT
            || k === K.RIGHT);
    },
    fitPointToCurrentLine: function(p) {
        var p1 = this.p1;
        var p2 = this.p2;
        if (this.model.mode !== 'empty') {
            if (! p1) {
                this.p1 = p;
            }
            else if (! p2 && (p.x !== p1.x || p.y !== p1.y)) {
                if (p.x !== p1.x && p.y !== p1.y) {
                    return undefined;
                }

                this.p2 = p;
            }
            else if (p1 && p2) {
                if (p1.x !== p2.x) {
                    return {x: p.x, y: p1.y}
                }
                else {
                    return {x: p1.x, y: p.y}
                }
            }
        }

        return p;
    },
    positionForXY: function(x, y) {
        x -= this.view.offset;
        y -= this.view.offset;
        if (x < 0) x = this.model.x;
        if (y < 0) y = this.model.y;
        var S  = this.view.tileSize;
        var B  = this.view.borderSize;
        var G  = S + B;
        var cx = (x/G) | 0;
        var cy = (y/G) | 0;
        cx = Math.min(cx, this.model.size - 1);
        cy = Math.min(cy, this.model.size - 1);
        var p = {x: cx, y: cy};
        var p1 = this.p1;
        var p2 = this.p2;
        return p;
    },
    keydown: function(event) {
        var k = event.which;
        if (this.keysHeld[k])
            return;
        console.log('KEYDOWN ' + k);
        console.log('KEYCODE ' + event.keyCode);

        this.keysHeld[k] = true;

        var fun = this.keyDownMap[k];
        if (fun) {
            if (this.isArrowKey(k)) {
                this.startRepeating(k, fun);
            }
            fun.call(this);
            event.preventDefault();
        }
    },
    keyup: function(event) {
        var k = event.which;
        console.log('KEYUP   ' + k);
        this.keysHeld[k] = false;
        this.stopRepeating(k);

        var fun = this.keyUpMap[k];
        if (fun) {
            fun.call(this);
            event.preventDefault();
        }
    },
    mousemove: function(event) {
        // console.log('MOUSEMOVE');
        var off = $(event.target).offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var p = this.positionForXY(x, y);
        // this.model.moveTo(p.x, p.y);
        p = this.fitPointToCurrentLine(p);
        if (p) {
            this.walkTo(p.x, p.y);
        }
    },
    mousedown: function(event) {
        console.log('MOUSEDOWN');
        this.mouseDown = true;
        var off = $(event.target).offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var button = event.which;
        if (button === 3) {
            this.dontShowContextMenu = true;
        }
        // console.log('pressed button', button);
        var p = this.positionForXY(x, y);
        // this.model.moveTo(p.x, p.y);
        p = this.fitPointToCurrentLine(p);
        if (p) {
            this.walkTo(p.x, p.y);
        }
        var fun = this.buttonDownMap[button];
        if (fun) {
            fun.call(this);
            event.preventDefault();
        }
    },
    contextmenu: function(event) {
        console.log('CONTEXTMENU');
        // console.log('contextmenu');
        if (this.dontShowContextMenu) {
            event.preventDefault();
            this.dontShowContextMenu = false;
        }
    },
    mouseup: function(event) {
        console.log('MOUSEUP');
        this.mouseDown = false;
        this.p1 = undefined;
        this.p2 = undefined;
        var button = event.which;
        var fun = this.buttonUpMap[button];
        if (fun) {
            fun.call(this);
            event.preventDefault();
        }
        // console.log('released button', button);
    },
    startRepeating: function(k, f) {
        var self = this;
        var n = 1;
        self.timeouts[k] = setTimeout(function() {
            self.intervals[k] = setInterval(function() {
                console.log('REPEAT #' + n + ' ' + k);
                n++;
                f.call(self);
            }, self.repeatInterval);
        }, self.repeatDelay);
    },
    stopRepeating: function(k) {
        var T = this.timeouts;
        var I = this.intervals;
        var t = T[k];
        var i = I[k];
        if (t) clearTimeout(t);
        if (i) clearInterval(i);
        T[k] = undefined;
        I[k] = undefined;
    },
});

return GameController;
})();
