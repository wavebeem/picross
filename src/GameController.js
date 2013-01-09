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
        1: function() { this.model.pushUndoHistory(); this.model.startMode('fill') },
        3: function() { this.model.pushUndoHistory(); this.model.startMode('mark') },
    },
    buttonUpMap: {
        1: function() { this.model.startMode('none') },
        3: function() { this.model.startMode('none') },
    },
    keyDownMap: {
        I: function() { this.view.resetTileSize() },
        O: function() { this.view.shrink() },
        P: function() { this.view.grow() },

        UP:    function() { this.model.moveDirection('up') },
        DOWN:  function() { this.model.moveDirection('down') },
        LEFT:  function() { this.model.moveDirection('left') },
        RIGHT: function() { this.model.moveDirection('right') },

        Z:     function() { this.model.pushUndoHistory(); this.model.startMode('mark') },
        SPACE: function() { this.model.pushUndoHistory(); this.model.startMode('fill') },

        U:     function() { this.model.undo() },
    },
    keyUpMap: {
        Z:     function() { this.model.startMode('none') },
        SPACE: function() { this.model.startMode('none') },
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

        self.$canvas = $('#game');

        _([
            'mousemove',
            'mousedown',
        ]).each(function(name) {
            bindHandler(self, self.$canvas, name);
        });

        _([
            'contextmenu',
            'mouseup',
            'keydown',
            'keyup',
        ]).each(function(name) {
            bindHandler(self, $(document), name);
        });
    },
    isArrowKey: function(k) {
        return (
               k === K.UP
            || k === K.DOWN
            || k === K.LEFT
            || k === K.RIGHT);
    },
    maybeDraw: function() {
        if (this.model.isDirty) {
            this.view.draw();
            this.minimap.draw();
            this.model.isDirty = false;
        }
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
        return {x: cx, y: cy};
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

        this.maybeDraw();
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

        this.maybeDraw();
    },
    mousemove: function(event) {
        // console.log('MOUSEMOVE');
        var off = $(event.target).offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var p = this.positionForXY(x, y);
        this.model.moveTo(p.x, p.y);
        this.maybeDraw();
    },
    mousedown: function(event) {
        console.log('MOUSEDOWN');
        var off = $(event.target).offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var button = event.which;
        if (button === 3) {
            this.dontShowContextMenu = true;
        }
        // console.log('pressed button', button);
        var p = this.positionForXY(x, y);
        this.model.moveTo(p.x, p.y);
        var fun = this.buttonDownMap[button];
        if (fun) {
            fun.call(this);
            event.preventDefault();
        }
        this.maybeDraw();
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
                self.maybeDraw();
            }, self.repeatInterval);
        }, self.repeatDelay);
    },
    stopRepeating: function(k) {
        var T = this.timeouts;
        var I = this.intervals
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
