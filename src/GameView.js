var GameView = (function() {
function GameView(opts) {
    this.init(opts);
}

_.extend(GameView.prototype, {
    incrementSize: 5,
    tileSize: 25,
    borderSize: 3,
    init: function(opts) {
        _.extend(this, opts);
        this.$canvas = $('#game');
        this.canvas = this.$canvas[0];
        this.setTileSize(this.tileSize);
        this.ctx = this.canvas.getContext('2d');
    },
    grow:   function() { this.setTileSize(this.tileSize + this.incrementSize) },
    shrink: function() { this.setTileSize(this.tileSize - this.incrementSize) },
    resetTileSize: function() { this.setTileSize(25) },
    setTileSize: function(x) {
        this.tileSize = util.clamp(x, 15, 60);
        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var HS = this.model.hintsSize;
        var CS = (TS + BS) * (MS + HS);
        var offset = (TS + BS) * HS;
        this.offset = offset;
        this.canvasSize    = CS;
        this.canvas.width  = CS;
        this.canvas.height = CS;
        if (this.ctx) {
            this.draw();
        }
    },
    draw: function() {
        var A = util.now();
        var ctx = this.ctx;
        if (! ctx)
            return;

        var CS = this.canvasSize;

        ctx.clearRect(0, 0, CS, CS);

        var F = this.offset;

        ctx.translate(F, F);

        this.drawBackground();
        this.drawSquares();
        this.drawMajorLines();
        this.drawCursor();

        ctx.translate(-F, -F);

        var B = util.now();
        // console.log((B - A) + ' ms');
    },
    drawBackground: function() {
        var ctx = this.ctx;

        var CS = this.canvasSize;

        var G = this.borderSize;
        var F = this.offset;

        ctx.fillStyle = colors.majorLines;
        ctx.fillRect(-G, -G, CS, CS);

        ctx.fillStyle = colors.minorLines;
        ctx.fillRect(0, 0, CS - F - G, CS - F - G);
    },
    drawMajorLines: function() {
        var ctx = this.ctx;

        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var F = this.offset;
        var S = T + G;
        var Q = S * N;
        var g = G/2;

        ctx.fillStyle = colors.majorLines;
        var p = 5;
        for (; p < N; p += 5) {
            ctx.fillRect((p - 1) * S + T, 0, G, Q);
            ctx.fillRect(0, (p - 1) * S + T, Q, G);
        }
    },
    drawSquares: function() {
        var ctx = this.ctx;
        var T = this.tileSize;
        var G = this.borderSize;
        var S = T + G;

        ctx.beginPath();
        this.model.eachCell(function(x, y, cell) {
            var O;

            var X = S * x;
            var Y = S * y;

            ctx.fillStyle = colors[cell.state === 'filled'
                ? 'filled'
                : 'background'
            ];
            ctx.fillRect(X, Y, T, T);

            // Draw an X to indicate the square is marked
            if (cell.state === 'marked') {
                // Offset from edge of square
                O = Math.max((S * 0.30) | 0, 1);

                ctx.strokeStyle = colors.marked;
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
    },
    drawCursor: function() {
        var ctx = this.ctx;

        var cx = this.model.x;
        var cy = this.model.y;

        var G = this.borderSize;
        var T = this.tileSize;
        var S = T + G;

        var X = cx * S;
        var Y = cy * S;
        var t = T - G;

        ctx.fillStyle = colors.highlight;
        ctx.fillRect(X + 0, Y + 0, T, G);
        ctx.fillRect(X + 0, Y + 0, G, T);
        ctx.fillRect(X + t, Y + 0, G, T);
        ctx.fillRect(X + 0, Y + t, T, G);

    },
    drawInsetBorder: function() {
        var ctx = this.ctx;
        var CS  = this.canvasSize;
        ctx.beginPath();
        ctx.strokeStyle = colors.shadow;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = 'butt';
        ctx.lineJoin    = 'miter';

        ctx.moveTo(0 , 0 );
        ctx.lineTo(CS, 0 );
        ctx.lineTo(CS, CS);
        ctx.lineTo(0 , CS);
        ctx.lineTo(0 , 0 );

        ctx.stroke();
        ctx.closePath();
    },
});

return GameView;
})();
