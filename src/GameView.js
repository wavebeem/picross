var GameView = (function() {
function GameView(opts) {
    this.init(opts);
}

_.extend(GameView.prototype, {
    incrementSize: 5,
    tileSize: 25,
    borderSize: 3,
    fontBold: true,
    fontSize: 14,
    fontName: 'sans-serif',
    fontColor: '#666',
    init: function(opts) {
        var self = this;
        _.extend(this, opts);
        this.$canvas = $('#game');
        this.canvas = this.$canvas[0];
        this.setTileSize(this.tileSize);
        this.ctx = this.canvas.getContext('2d');
        this.model.events.register('draw', function() {
            self.draw();
        });
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
        var SC = MS/5;
        var CS = (TS + BS) * (MS + HS);
        var offset = (TS + BS) * HS;
        this.offset = offset;
        this.canvasSize    = CS;
        this.canvas.width  = CS;
        this.canvas.height = CS;
        this.subsectionCount = SC;
        this.fontSize = Math.round(0.60 * TS);
        if (this.ctx) {
            this.draw();
        }
    },
    draw: function() {
        var ctx = this.ctx;

        var CS = this.canvasSize;

        ctx.clearRect(0, 0, CS, CS);

        var F = this.offset;

        this.drawHintsBackground();
        this.drawHints();

        ctx.translate(F, F);

        this.drawBackground();
        this.shouldShadeSubsections = true;
        this.drawSquares();
        this.drawMajorLines();
        this.drawCursor();
        this.drawInsetBorder();

        ctx.translate(-F, -F);
    },
    drawHints: function() {
        var self = this;
        var ctx  = this.ctx;

        var hx = self.model.hintsX;
        var hy = self.model.hintsY;

        var FS = self.fontSize;
        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var F = this.offset;
        var S = T + G;
        var i, j;

        ctx.translate(F, 0);
        for (i = 0; i < N; i++) {
            M = hx[i].length;
            for (j = 0; j < M; j++) {
                self.drawTextInsideRect(
                    i * S,
                    (F - T - T) - j * T,
                    T,
                    '' + hx[i][j]
                );
            }
        }
        ctx.translate(-F, 0);
        ctx.translate(0, F);
        for (i = 0; i < N; i++) {
            M = hy[i].length;
            for (j = 0; j < M; j++) {
                self.drawTextInsideRect(
                    (F - T - T) - j * T,
                    i * S - FS/2,
                    T,
                    '' + hy[i][j]
                );
            }
        }
        ctx.translate(0, -F);
    },
    drawTextInsideRect: function(x, y, s, text) {
        var ctx = this.ctx;
        ctx.font         = (this.fontBold ? 'bold ' : '') + this.fontSize + 'px ' + this.fontName;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle    = this.fontColor;

        ctx.fillText(text, x + s/2, y + s/2, s);
    },
    drawHintsBackground: function() {
        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var F = this.offset;
        var S = T + G;
        var i;

        var ctx = this.ctx;

        var grad = ctx.createLinearGradient(0, 0, 0, 4*T);
        grad.addColorStop(0, colors.hintsFade);
        grad.addColorStop(1, colors.hintsBG);
        ctx.fillStyle = grad;

        ctx.translate(F, 0);
        for (i = 1; i < N; i += 2) {
            ctx.fillRect(i * S, 0, T, F);
        }
        ctx.translate(-F, 0);

        var grad = ctx.createLinearGradient(0, 0, 4*T, 0);
        grad.addColorStop(0, colors.hintsFade);
        grad.addColorStop(1, colors.hintsBG);
        ctx.fillStyle = grad;

        ctx.translate(0, F);
        for (i = 1; i < N; i += 2) {
            ctx.fillRect(0, i * S, F, T);
        }
        ctx.translate(0, -F);
    },
    drawBackground: function() {
        var ctx = this.ctx;

        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var HS = this.model.hintsSize;
        var Q = (TS + BS) * MS;
        var G = this.borderSize;

        ctx.fillStyle = colors.majorLines;
        ctx.fillRect(-G, -G, Q + G, Q + G);

        ctx.fillStyle = colors.minorLines;
        ctx.fillRect(0, 0, Q - G, Q - G);
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

        var p;
        var x, y, w, h;

        ctx.beginPath();
        ctx.fillStyle = colors.shadeLine;
        for (p = 5; p < N; p += 5) {
            x = (p - 1) * S + T;
            y = 0;
            w = G;
            h = Q - G;
            ctx.rect(x - 1, y, G + 2, h);

            x = 0;
            y = (p - 1) * S + T;
            w = Q - G;
            h = G;
            ctx.rect(x, y - 1, w, G + 2);
        }
        ctx.fill();
        ctx.closePath();
    },
    drawSquares: function() {
        var self = this;
        var ctx = this.ctx;
        var T = this.tileSize;
        var G = this.borderSize;
        var S = T + G;
        var N = this.model.size;

        this.model.eachCell(function(x, y, cell) {
            var O;

            var X = S * x;
            var Y = S * y;
            var A = X + T - 1;
            var B = Y + T - 1;

            var state = cell.state;

            ctx.fillStyle = colors[state === 'filled'
                ? 'filled'
                : 'background'
            ];
            ctx.fillRect(X, Y, T, T);

            var odd   = util.odd;
            var floor = Math.floor;

            if (self.shouldShadeSubsections && state !== 'filled') {
                var sx = floor(x/5);
                var sy = floor(y/5);

                if (odd(sx + sy)) {
                    ctx.fillStyle = colors.cellShade;
                    ctx.fillRect(X, Y, T, T);
                }
            }

            ctx.beginPath();
            ctx.fillStyle = colors.shadeCell;

            ctx.rect(X, Y, T, 1);
            ctx.rect(X, Y, 1, T);

            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = colors.shadeLess;

            ctx.rect(A, Y, 1, T);
            ctx.rect(X, B, T, 1);

            ctx.fill();
            ctx.closePath();

            // Draw an X to indicate the square is marked
            if (cell.state === 'marked') {
                // Offset from edge of square
                O = Math.max((S * 0.30) | 0, 1);
                o = 1;

                ctx.lineWidth = Math.max((S * 0.10) | 0, 3);
                ctx.lineCap   = 'round';
                ctx.lineJoin  = 'round';


                ctx.beginPath();
                ctx.strokeStyle = colors.shadowX;
                ctx.moveTo(X + 0 + O, Y + 0 + O + o);
                ctx.lineTo(X + T - O, Y + T - O + o);
                ctx.moveTo(X + T - O, Y + 0 + O + o);
                ctx.lineTo(X + 0 + O, Y + T - O + o);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.strokeStyle = colors.marked;
                ctx.moveTo(X + 0 + O, Y + 0 + O);
                ctx.lineTo(X + T - O, Y + T - O);
                ctx.moveTo(X + T - O, Y + 0 + O);
                ctx.lineTo(X + 0 + O, Y + T - O);
                ctx.stroke();
                ctx.closePath();
            }
        });
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
        ctx.beginPath();
        ctx.rect(X + 0, Y + 0, T, G);
        ctx.rect(X + 0, Y + 0, G, T);
        ctx.rect(X + t, Y + 0, G, T);
        ctx.rect(X + 0, Y + t, T, G);
        ctx.fill();
        ctx.closePath();

    },
    drawInsetBorder: function() {
        var ctx = this.ctx;

        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var HS = this.model.hintsSize;
        var G  = this.borderSize;
        var F  = this.offset;
        var Q  = (TS + BS) * MS - G;
        var q  = Q - 1;

        ctx.beginPath();
        ctx.fillStyle = colors.shadow;

        ctx.rect(0, 0, Q, 1);
        ctx.rect(q, 0, 1, Q);
        ctx.rect(0, q, Q, 1);
        ctx.rect(0, 0, 1, Q);

        ctx.fill();
        ctx.closePath();
    },
});

return GameView;
})();
