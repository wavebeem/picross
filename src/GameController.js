GameController = (function() {
function GameController(opts) {
    this.init(opts);
}

var bindHandler = function(context, element, name) {
    element.on(name, function(event) { context[name](event) });
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
    mousemove: function(event) {
        var off = $(event.target).parent().offset();
        var x = event.pageX - off.left;
        var y = event.pageY - off.top;
        // console.log('moved', x, y);
        this.model.setPosition(x, y);
        this.view.draw();
    },
    touchstart: function(event) {
        var touch = event.targetTouches[0];
        var off = $(event.target).parent().offset();
        var x = touch.pageX - off.left;
        var y = touch.pageY - off.top;
        // console.log('moved', x, y);
        this.model.setPosition(x, y);
        this.view.draw();
    },
    mousedown: function(event) {
        var x = event.clientX;
        var y = event.clientY;
        var button = event.which;
        // console.log('pressed button', button);
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
