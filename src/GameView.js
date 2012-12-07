GameView = (function() {
function GameView(opts) {
    this.init(opts);
}

var gray = function(n) {
    return 'rgb(' + [n, n, n] + ')';
};

var colors = _.map(_.range(0, 2), function(n) {
    return gray(n * 10 + 240);
});

var i = 0;
var color = function(n) {
    return colors[n % colors.length];
};

_.extend(GameView.prototype, {
    tileSize: 24,
    puzzleSize: 10,
    init: function(opts) {
        _.extend(this, opts);
        this.$canvas = $('#game');
        this.canvas = this.$canvas.get(0);
        this.canvasSize = this.tileSize * this.puzzleSize;
        this.canvas.width  = this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.ctx = this.canvas.getContext('2d');
    },
    draw: function() {
        var A = util.now();
        var ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        var K = this.puzzleSize;
        var S = this.tileSize;
        _.times(K, function(x) {
            _.times(K, function(y) {
                ctx.fillStyle = color(x + i++);
                ctx.fillRect(S * x, S * y, S, S);
            });
        });

        var w = 16;
        ctx.fillStyle = 'rgba(192, 0, 0, 0.50)';
        ctx.fillRect(this.model.x - w/2, this.model.y - w/2, w, w);
        var B = util.now();
        console.log((B - A) + ' ms');
    },
});

return GameView;
})();
