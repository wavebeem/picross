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
        bindHandler(this, this.$canvas, 'mousemove');
        bindHandler(this, this.$canvas, 'mousedown');
        bindHandler(this, this.$canvas, 'contextmenu');
        bindHandler(this, $(document),  'mouseup');
    },
    mousemove: function(event) {
        var x = event.clientX;
        var y = event.clientY;
        // console.log('moved', x, y);
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
        this.view.doTheWave();
    },
});

return GameController;
})();
