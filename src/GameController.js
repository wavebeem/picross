GameController = (function() {
function GameController(opts) {
    this.init(opts);
}

var bindHandler = function(context, element, name) {
    element.on(name, function(event) {
        context[name](event);
    });
};

var K = {
    MINUS_:  173,
    EQUALS_:  61,

    MINUS:  189,
    EQUALS: 187,
    ZERO:    48,

    UP:      38,
    DOWN:    40,
    LEFT:    37,
    RIGHT:   39,

    SPACE:   32,

    Z:  90,
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
    _(['MINUS', 'EQUALS']).each(function(name) {
        map[name + '_'] = map[name];
    });
}

_.extend(GameController.prototype, {
    buttonDownMap: {
        1: function() { this.model.startMode('fill') },
        3: function() { this.model.startMode('mark') },
    },
    buttonUpMap: {
        1: function() { this.model.startMode(undefined) },
        3: function() { this.model.startMode(undefined) },
    },
    keyDownMap: {
        MINUS:  function() { this.view.shrink() },
        EQUALS: function() { this.view.grow() },
        ZERO:   function() { this.view.resetTileSize() },

        UP:    function() { this.model.moveDirection('up') },
        DOWN:  function() { this.model.moveDirection('down') },
        LEFT:  function() { this.model.moveDirection('left') },
        RIGHT: function() { this.model.moveDirection('right') },

        Z:     function() { this.model.startMode('mark') },
        SPACE: function() { this.model.startMode('fill') },
    },
    keyUpMap: {
        Z:     function() { this.model.startMode(undefined) },
        SPACE: function() { this.model.startMode(undefined) },
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
            this.model.isDirty = false;
        }
    },
    positionForXY: function(x, y) {
        var S  = this.view.tileSize;
        var B  = this.view.borderSize;
        var G  = S + B;
        var cx = ((x/G) | 0) - 0;
        var cy = ((y/G) | 0) - 0;
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
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var p = this.positionForXY(x, y);
        this.model.moveTo(p.x, p.y);
        this.maybeDraw();
    },
    mousedown: function(event) {
        console.log('MOUSEDOWN');
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var button = event.which;
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
        event.preventDefault();
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
