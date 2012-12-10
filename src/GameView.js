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
    tileSize: 32,
    init: function(opts) {
        _.extend(this, opts);
        this.$canvas = $('#game');
        this.canvas = this.$canvas.get(0);
        this.canvasSize = this.tileSize * this.model.size;
        this.canvas.width  = this.canvasSize;
        this.canvas.height = this.canvasSize;
        var ctx = this.canvas.getContext('2d');
        var S = this.tileSize;
        // ctx.lineWidth = 3;
        ctx.lineWidth = Math.max((S * 0.10) | 0, 1);
        ctx.lineCap   = 'round';
        ctx.lineJoin  = 'round';
        this.ctx = ctx;
    },
    draw: function() {
        var A = util.now();
        var ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        var S = this.tileSize;
        ctx.beginPath();
        this.model.eachCell(function(x, y, cell) {
            var X = S * x;
            var Y = S * y;

            ctx.fillStyle = color(x + y);
            ctx.fillRect(X, Y, S, S);

            // Draw an X to indicate the square is marked
            if (cell.state === 'marked') {
                // Offset from edge of square
                var O = Math.max((S * 0.20) | 0, 1);
                // var O = 9;

                ctx.strokeStyle = gray(150);

                ctx.moveTo(X     + O, Y     + O);
                ctx.lineTo(X + S - O, Y + S - O);
                ctx.moveTo(X + S - O, Y     + O);
                ctx.lineTo(X     + O, Y + S - O);
            }
        });
        ctx.stroke();

        var w = 16;
        ctx.fillStyle = 'rgba(192, 0, 0, 0.50)';
        ctx.fillRect(this.model.x - w/2, this.model.y - w/2, w, w);
        var B = util.now();
        console.log((B - A) + ' ms');
    },
});

return GameView;
})();
