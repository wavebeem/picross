GameController = (function() {
function GameController(opts) {
    this.init(opts);
}

var bindHandler = function(context, element, name) {
    element.on(name, function(event) {
        context[name](event);
    });
};

_.extend(GameController.prototype, {
    init: function(opts) {
        _.extend(this, opts);

        var self = this;

        this.$canvas = $('#game');

        var events = [
            'mousemove',
            'touchstart',
            'mousedown',
            'contextmenu',
        ];

        _(events).each(function(name) {
            bindHandler(self, self.$canvas, name);
        });

        bindHandler(this, $(document), 'mouseup');
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
    mousemove: function(event) {
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var p = this.positionForXY(x, y);
        this.model.setPosition(p.x, p.y);
        this.view.draw();
    },
    touchstart: function(event) {
        var touch = event.targetTouches[0];
        var off = $(event.target).parent().offset();
        var x = touch.pageX - off.left;
        var y = touch.pageY - off.top;
        // console.log('moved', x, y);
        this.view.draw();
    },
    mousedown: function(event) {
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        var button = event.which;
        // console.log('pressed button', button);
        var p = this.positionForXY(x, y);
        var cell = this.model.getCell(p.x, p.y);
        cell.state = 'filled';
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
