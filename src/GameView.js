GameView = (function() {
function GameView(opts) {
    this.init(opts);
}

var gray = function(n) {
    return 'rgb(' + [n, n, n] + ')';
};

var colors = _([240, 250]).map(gray);
var color = function(n) {
    return colors[n % colors.length];
};

var blue = '#729fcf';

_.extend(GameView.prototype, {
    tileSize: 24,
    borderSize: 3,
    init: function(opts) {
        _.extend(this, opts);
        this.$canvas = $('#game');
        this.canvas = this.$canvas.get(0);
        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var CS = (TS + BS) * MS - BS;
        this.canvasSize    = CS;
        this.canvas.width  = CS;
        this.canvas.height = CS;
        this.ctx = this.canvas.getContext('2d');
    },
    draw: function() {
        var A = util.now();
        var ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var S = T + G;
        var Q = S * N;
        var g = G/2;

        ctx.beginPath();
        this.model.eachCell(function(x, y, cell) {
            var X = S * x;
            var Y = S * y;

            if (cell.state === 'filled') {
                ctx.fillStyle = gray(187);
            }
            else {
                ctx.fillStyle = color(x + y);
                // ctx.fillStyle = gray(245);
            }
            ctx.fillRect(X, Y, T, T);

            // Draw an X to indicate the square is marked
            if (cell.state === 'marked') {
                // Offset from edge of square
                var O = Math.max((S * 0.30) | 0, 1);
                // var O = 9;

                ctx.strokeStyle = gray(175);
                ctx.lineWidth = Math.max((S * 0.10) | 0, 3);
                ctx.lineCap   = 'round';
                ctx.lineJoin  = 'round';

                ctx.moveTo(X + 0 + O, Y + 0 + O);
                ctx.lineTo(X + T - O, Y + T - O);
                ctx.moveTo(X + T - O, Y + 0 + O);
                ctx.lineTo(X + 0 + O, Y + T - O);
            }
        });
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = gray(210);
        _(N - 1).times(function(x) {
            var X = x + 1;
            if (X >= 5 && X % 5 === 0) {
                ctx.fillRect(x * S + T, 0, G, Q);
            }
        });
        _(N - 1).times(function(y) {
            var Y = y + 1;
            if (Y >= 5 && Y % 5 === 0) {
                ctx.fillRect(0, y * S + T, Q, G);
            }
        });

        var cx = this.model.x;
        var cy = this.model.y;

        var X = cx * S;
        var Y = cy * S;
        var t = T - G;
        ctx.fillStyle = blue;
        ctx.fillRect(X + 0, Y + 0, T, G);
        ctx.fillRect(X + 0, Y + 0, G, T);
        ctx.fillRect(X + t, Y + 0, G, T);
        ctx.fillRect(X + 0, Y + t, T, G);

        var B = util.now();
        console.log((B - A) + ' ms');
    },
});

return GameView;
})();
