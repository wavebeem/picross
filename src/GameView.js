var GameView = (function() {
function GameView(opts) {
    this.init(opts);
}

var sizeMapping = {
    25:  3,
    20:  3,
    15:  4,
    10:  6,
     5: 12,
};

var layers = [
    'hintsBG',
    'hintsText',
    'background',
    'squares',
    'grid',
    'minimap',
    'inset',
    'cursor',
];

var numLayers = layers.length;

var nameToLayerNum = {};
_(layers).each(function(name, i) {
    nameToLayerNum[name] = i;
});

_.extend(GameView.prototype, {
    incrementSize: 5,
    defaultTileSize: 25,
    borderSize: 3,
    fontBold: true,
    fontSize: 14,
    fontName: 'sans-serif',
    shouldShadeSubsections: false,
    shouldShadeX: false,
    init: function(opts) {
        var self = this;
        _.extend(this, opts);
        this.container = $('#game');
        this.makeLayers();
        this.setTileSize(this.defaultTileSize);
        this.model.events.register('update', function(data) {
            self.drawLayer(data.layer);
        });
        _(layers).each(self.drawLayer, self);
    },
    drawLayer: function(layer) {
        this['draw_' + layer]();
    },
    makeLayers: function() {
        var self = this;
        self.canvases = [];
        self.contexts = [];
        _(numLayers).times(function(i) {
            var canvas = $('<canvas>')
                .css('zIndex', 100 + i)
                .addClass('layer-' + i);
            self.canvases[i] = canvas;
            self.contexts[i] = canvas[0].getContext('2d');
            self.container.append(canvas);
        });
    },
    getContextByName: function(name) {
        var num = nameToLayerNum[name];
        return this.contexts[num];
    },
    grow:   function() { this.growBy(+1) },
    shrink: function() { this.growBy(-1) },
    growBy: function(k) { this.setTileSize(this.tileSize + k*this.incrementSize) },
    resetTileSize: function() { this.setTileSize(this.defaultTileSize) },
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
        this.canvasSize = CS;
        _(this.canvases).each(function(canvas) {
            canvas.prop({
                width:  CS,
                height: CS,
            });
        });
        this.container.css({
            width:  CS + 'px',
            height: CS + 'px',
        });
        this.subsectionCount = SC;
        this.fontSize = Math.round(0.60 * TS);
        $('#content').css('width', CS + 'px');
        this.draw();
    },
    clearContext: function(ctx) {
        var CS = this.canvasSize;
        ctx.clearRect(0, 0, CS, CS);
    },
    draw: function() {
        _(layers).each(this.drawLayer, this);
    },
    offsetContext: function(ctx, factor) {
        var F = factor * this.offset;
        ctx.translate(F, F);
    },
    draw_minimap: function() {
        var self = this;
        var N  = self.model.size;
        var S  = sizeMapping[N];
        var P  = 30;
        var CS = S * N;
        var CSP = CS + P;
        var ctx = self.getContextByName('minimap');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);
        ctx.translate(-CSP, -CSP);

        ctx.fillStyle = colors.minimapBG;
        ctx.fillRect(0, 0, CS, CS);

        ctx.fillStyle = colors.outerShadow;
        util.drawBorderOutsideRect(ctx, 0, 0, CS, CS, 3);
        ctx.fillStyle = colors.innerShadow;
        util.drawBorderInsideRect (ctx, 0, 0, CS, CS, 1);

        ctx.fillStyle = 'black';
        self.model.eachCell(function(x, y, cell) {
            if (cell.state === 'filled') {
                ctx.fillRect(S * x, S * y, S, S);
            }
        });
        ctx.translate(CSP, CSP);
        this.offsetContext(ctx, -1);
    },
    draw_hintsText: function() {
        var self = this;
        var ctx  = self.getContextByName('hintsText');

        self.clearContext(ctx);

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
                    ctx,
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
                    ctx,
                    (F - T - T) - j * T,
                    i * S - FS/2,
                    T,
                    '' + hy[i][j]
                );
            }
        }
        ctx.translate(0, -F);
    },
    drawTextInsideRect: function(ctx, x, y, s, text) {
        ctx.font         = (this.fontBold ? 'bold ' : '') + this.fontSize + 'px ' + this.fontName;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle    = colors.fontNormal;

        ctx.fillText(text, x + s/2, y + s/2, s);
    },
    draw_hintsBG: function() {
        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var F = this.offset;
        var S = T + G;
        var i;

        var ctx = this.getContextByName('hintsBG');
        this.clearContext(ctx);

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
    draw_background: function() {
        var ctx = this.getContextByName('background');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);

        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var HS = this.model.hintsSize;
        var Q = (TS + BS) * MS;
        var G = this.borderSize;

        ctx.fillStyle = colors.outsideBorder;
        ctx.fillRect(-G, -G, Q + G, Q + G);

        ctx.fillStyle = colors.minorLines;
        ctx.fillRect(0, 0, Q - G, Q - G);
        this.offsetContext(ctx, -1);
    },
    draw_grid: function() {
        // return;
        var ctx = this.getContextByName('grid');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);

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
        ctx.fillStyle = colors.majorLines;
        for (p = 5; p < N; p += 5) {
            x = (p - 1) * S + T;
            y = 0;
            w = G;
            h = Q - G;
            // ctx.rect(x - 1, y, G + 2, h);
            ctx.rect(x, y, G, h);

            x = 0;
            y = (p - 1) * S + T;
            w = Q - G;
            h = G;
            // ctx.rect(x, y - 1, w, G + 2);
            ctx.rect(x, y, w, G);
        }
        ctx.fill();
        ctx.closePath();
        this.offsetContext(ctx, -1);
    },
    draw_squares: function() {
        var self = this;
        var ctx = this.getContextByName('squares');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);
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

            if (state === 'filled') {
                ctx.beginPath();
                ctx.fillStyle = colors.shadeCell;
                ctx.rect(X, Y, T, 1);
                ctx.rect(X, Y, 1, T);
                ctx.fill();
                ctx.closePath();

                // ctx.beginPath();
                // ctx.fillStyle = colors.shadeCell;
                // ctx.rect(X + 1, Y + 1, T - 2, 1);
                // ctx.rect(X + 1, Y + 1, 1, T - 2);
                // ctx.fill();
                // ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = colors.shadeLess;
                // ctx.fillStyle = colors.light;
                ctx.rect(A, Y, 1, T);
                ctx.rect(X, B, T, 1);
                ctx.fill();
                ctx.closePath();
            }

            // Draw an X to indicate the square is marked
            if (cell.state === 'marked') {
                // Offset from edge of square
                O = Math.max((S * 0.30) | 0, 1);
                o = 1;

                ctx.lineWidth = Math.max((S * 0.10) | 0, 3);
                ctx.lineCap   = 'round';
                ctx.lineJoin  = 'round';


                if (self.shouldShadeX) {
                    ctx.beginPath();
                    ctx.strokeStyle = colors.shadowX;
                    ctx.moveTo(X + 0 + O, Y + 0 + O + o);
                    ctx.lineTo(X + T - O, Y + T - O + o);
                    ctx.moveTo(X + T - O, Y + 0 + O + o);
                    ctx.lineTo(X + 0 + O, Y + T - O + o);
                    ctx.stroke();
                    ctx.closePath();
                }

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
        this.offsetContext(ctx, -1);
    },
    draw_cursor: function() {
        var ctx = this.getContextByName('cursor');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);

        var cx = this.model.x;
        var cy = this.model.y;

        var G = this.borderSize;
        var T = this.tileSize;
        var S = T + G;

        var X = cx * S;
        var Y = cy * S;
        var t = T - G;

        ctx.fillStyle = colors.highlight;
        util.drawBorderOutsideRect(ctx, X, Y, T, T, 3);

        ctx.fillStyle = colors.cursorShadow;
        util.drawBorderInsideRect(ctx, X, Y, T, T, 1);

        this.offsetContext(ctx, -1);
    },
    draw_inset: function() {
        var ctx = this.getContextByName('inset');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);

        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var Q  = (TS + BS) * MS;
        var G = this.borderSize;

        ctx.fillStyle = colors.insetShadow;
        util.drawBorderInsideRect(ctx, 0, 0, Q - G, Q - G, 1);

        this.offsetContext(ctx, -1);
    },
});

return GameView;
})();
