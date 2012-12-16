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
    MINUS:  189,
    EQUALS: 187,
    ZERO:    48,

    MINUS_:  173,
    EQUALS_:  61,

    UP:      38,
    DOWN:    40,
    LEFT:    37,
    RIGHT:   39,
};

_.extend(GameController.prototype, {
    buttonMap: {
        1: 'filled',
        2: 'empty',
        3: 'marked',
    },
    keyMap: {
        MINUS:  function() { this.view.shrink() },
        EQUALS: function() { this.view.grow() },
        ZERO:   function() { this.view.resetTileSize() },

        MINUS_:  function() { this.view.shrink() },
        EQUALS_: function() { this.view.grow() },

        UP:    function() { this.model.moveCursor('up') },
        DOWN:  function() { this.model.moveCursor('down') },
        LEFT:  function() { this.model.moveCursor('left') },
        RIGHT: function() { this.model.moveCursor('right') },
    },
    mode: 0,
    repeatInterval: 100,
    repeatDelay: 300,
    init: function(opts) {
        _.extend(this, opts);

        var self = this;

        this.intervals = {};
        this.timeouts  = {};

        var pairs = _.pairs(this.keyMap);
        this.keyMap = {};
        _.each(pairs, function(pair) {
            var a = pair[0];
            var b = pair[1];
            self.keyMap[K[a]] = b;
        });
        _(['MINUS', 'EQUALS']).each(function(name) {
            self.keyMap[name + '_'] = self.keyMap[name];
        });

        this.keysHeld = {};

        this.$canvas = $('#game');

        var events = [
        ];

        _([
            'mousemove',
            'mousedown',
            'contextmenu',
        ]).each(function(name) {
            bindHandler(self, self.$canvas, name);
        });

        _([
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
        var fun = this.keyMap[k];

        this.keysHeld[k] = true;

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
    },
    mousemove: function(event) {
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var p = this.positionForXY(x, y);
        this.model.setPosition(p.x, p.y);
        this.maybeDraw();
    },
    mousedown: function(event) {
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var button = event.which;
        // console.log('pressed button', button);
        var p = this.positionForXY(x, y);
        if (this.buttonMap[button]) {
            this.model.setCellStateAt(p.x, p.y, this.buttonMap[button]);
        }
        this.maybeDraw();
        event.preventDefault();
    },
    contextmenu: function(event) {
        // console.log('contextmenu');
        event.preventDefault();
    },
    mouseup: function(event) {
        var button = event.which;
        // console.log('released button', button);
        event.preventDefault();
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
        var t = this.timeouts [k];
        var i = this.intervals[k];
        if (t) clearTimeout(t);
        if (i) clearInterval(i);
        this.timeouts [k] = undefined;
        this.intervals[k] = undefined;
    },
});

return GameController;
})();
