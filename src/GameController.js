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
    },
    mode: 0,
    init: function(opts) {
        _.extend(this, opts);

        var self = this;

        var pairs = _.pairs(this.keyMap);
        this.keyMap = {};
        _.each(pairs, function(pair) {
            var a = pair[0];
            var b = pair[1];
            self.keyMap[K[a]] = b;
        });

        this.$canvas = $('#game');

        var events = [
            'keydown',
            'mousemove',
            'touchstart',
            'mousedown',
            'contextmenu',
        ];

        _(events).each(function(name) {
            bindHandler(self, self.$canvas, name);
        });

        bindHandler(this, $(document), 'mouseup');
        bindHandler(this, $(document), 'keydown');
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
        console.log('KEY ' + k);
        var fun = this.keyMap[k];
        if (fun) {
            fun.call(this);
        }
    },
    mousemove: function(event) {
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var p = this.positionForXY(x, y);
        this.model.setPosition(p.x, p.y);
        this.maybeDraw();
    },
    touchstart: function(event) {
        var touch = event.targetTouches[0];
        var off = $(event.target).parent().offset();
        var x = touch.pageX - off.left;
        var y = touch.pageY - off.top;
        // console.log('moved', x, y);
        this.maybeDraw();
        event.preventDefault();
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
});

return GameController;
})();
