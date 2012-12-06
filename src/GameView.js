GameView = (function() {
function GameView() {
    this.init();
}

var gray = function(n) {
    return 'rgb(' + [n, n, n] + ')';
};

var colors = _.map(_.range(1, 90), function(n) {
    return gray(n * 2 + 90);
});

var i = 0;
var color = function(n) {
    return colors[n % colors.length];
};

_.extend(GameView.prototype, {
    tileSize: 32,
    puzzleSize: 10,
    init: function() {
        this.$canvas = $('#game');
        this.canvas = this.$canvas.get(0);
        this.canvasSize = this.tileSize * this.puzzleSize;
        this.canvas.width  = this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.ctx = this.canvas.getContext('2d');
    },
    draw: function() {
        var ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        var K = this.puzzleSize;
        var S = this.tileSize;
        _.times(K, function(x) {
            _.times(K, function(y) {
                ctx.fillStyle = color(i + x + y);
                ctx.fillRect(S * x, S * y, S, S);
            });
        });
        i++;
    },
    doTheWave: function() {
        var self = this;
        var id = setInterval(function() { self.draw() }, 20);
        setTimeout(function() { clearInterval(id) }, 3000);
    },
});

return GameView;
})();
