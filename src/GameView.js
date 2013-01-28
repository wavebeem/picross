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
    'crosshair',
    'cursor',
];

var groups = {
    hints:  ['hintsBG', 'hintsText'],
    data:   ['squares', 'minimap'  ],
    // cursor: ['cursor',  'crosshair', 'hintsText', 'hintsBG'],
    cursor: ['cursor',  'crosshair', 'hintsBG'],
};

var numLayers = layers.length;

var nameToLayerNum = {};
_(layers).each(function(name, i) {
    nameToLayerNum[name] = i;
});

_.extend(GameView.prototype, {
    whichAltBG: 'odd',
    // whichAltBG: 'even',
    alwaysDrawHintsBorders: true,
    paddingHintsBG: 1,
    incrementSize: 5,
    defaultTileSize: 25,
    borderSize: 3,
    fontBold: true,
    fontName: 'Candal, Georgia, serif',
    shouldShadeSubsections: false,
    shouldDrawCheckerboard: true,
    shouldShadeAllCells: false,
    shouldDrawCrosshair: false,
    shouldShadeX: true,
    fontBaselineOffset: -1,
    init: function(opts) {
        var self = this;
        _.extend(this, opts);
        this.container = $('#game');
        this.gradients = {
            light: {},
            shade: {},
            alt:   {},
            bg:    {},
        };
        this.makeLayers();
        this.setTileSize(this.defaultTileSize);
        this.model.events.register('update', function(data) {
            if (data.group) {
                self.drawGroup(data.group);
            }
            else if (data.layer) {
                self.drawLayer(data.layer);
            }
        });
        _(layers).each(self.drawLayer, self);
    },
    drawLayer: function(layer) {
        this['draw_' + layer]();
    },
    drawGroup: function(group) {
        _(groups[group]).each(this.drawLayer, this);
    },
    makeLayers: function() {
        var self = this;
        self.canvases = [];
        self.contexts = [];
        _(numLayers).times(function(i) {
            var canvas = $('<canvas>')
                .css('zIndex', 100 + i)
                .addClass('layer layer-' + i);
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
        this.tileSize = util.clamp(x, 20, 60);
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
        this.fontSize = Math.round(0.55 * TS);
        $('#content').css('width', CS + 'px');
        this.constructGradients();
        this.draw();
    },
    constructGradients: function() {
        var F = this.offset;
        var ctx = this.getContextByName('hintsBG');
        var grad;

        var bgGrad = [
            [0.00, colors.hintsFade],
            [0.99, colors.hintsBG  ],
        ];

        var altGrad = [
            [0.00, colors.hintsAltFade],
            [0.99, colors.hintsAltBG  ],

            // [0.00, colors.hintsFade],
            // [0.50, colors.hintsBG  ],
        ];

        var lightGrad = [
            [0.00, colors.lightFade],
            [0.50, colors.lightBG  ],
            [1.00, colors.lightFade],
        ];

        var shadeGrad = [
            [0.00, colors.shadeFade],
            [0.50, colors.shadeBG  ],
            [1.00, colors.shadeFade],
        ];

        this.gradients.bg.vertical   = util.vertGradient (ctx, F, bgGrad);
        this.gradients.bg.horizontal = util.horizGradient(ctx, F, bgGrad);

        this.gradients.alt.vertical   = util.vertGradient (ctx, F, altGrad);
        this.gradients.alt.horizontal = util.horizGradient(ctx, F, altGrad);

        this.gradients.light.vertical   = util.vertGradient (ctx, F, lightGrad);
        this.gradients.light.horizontal = util.horizGradient(ctx, F, lightGrad);

        this.gradients.shade.vertical   = util.vertGradient (ctx, F, shadeGrad);
        this.gradients.shade.horizontal = util.horizGradient(ctx, F, shadeGrad);
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
        if (N < 10) return;
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

        var cx = self.model.x;
        var cy = self.model.y;

        var sel;
        var textColors = [
            colors.fontNormal,
            colors.fontSelected,
        ];

        ctx.strokeStyle = colors.fontStroke;

        ctx.translate(F, 0);
        for (i = 0; i < N; i++) {
            M = hx[i].length;
            for (j = 0; j < M; j++) {
                sel = ~~(cx === i);
                ctx.fillStyle = textColors[sel];
                self.drawTextInsideRect(
                    ctx,
                    i * S,
                    (F - T - G) - j * T,
                    T,
                    '' + hx[i][j],
                    sel
                );
            }
        }
        ctx.translate(-F, 0);
        ctx.translate(0, F);
        for (i = 0; i < N; i++) {
            M = hy[i].length;
            for (j = 0; j < M; j++) {
                sel = ~~(cy === i);
                ctx.fillStyle = textColors[sel];
                self.drawTextInsideRect(
                    ctx,
                    (F - T - G) - j * T,
                    // i * S,
                    i * S + self.fontBaselineOffset,
                    T,
                    '' + hy[i][j],
                    sel
                );
            }
        }
        ctx.translate(0, -F);
    },
    drawTextInsideRect: function(ctx, x, y, s, text, stroke) {
        ctx.font         = (this.fontBold ? 'bold ' : '') + this.fontSize + 'px ' + this.fontName;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        var w= ctx.measureText(text).width;

        // var X = x + s/2;
        var X = x + s/2;
        var Y = y + s/2;

        ctx.fillText(text, X, Y, s);
    },
    draw_hintsBG: function() {
        var N = this.model.size;
        var G = this.borderSize;
        var T = this.tileSize;
        var F = this.offset;
        var S = T + G;
        var Q = this.paddingHintsBG;
        var edgeWidth = 1.0;
        var i;

        var ctx = this.getContextByName('hintsBG');
        this.clearContext(ctx);

        var cx = this.model.x;
        var cy = this.model.y;

        var grad;
        var sel;

        var o = 3;
        ctx.translate(F, 0);
        var alt = util[this.whichAltBG];
        for (i = 0; i < N; i++) {
            sel = (cx === i);
            if (! sel && alt(i)) {
                ctx.fillStyle = colors.hintsAltBG;
                ctx.fillRect(i * S - Q, 0, T + 2*Q, F);
                ctx.fillStyle = this.gradients.alt.vertical;
                util.drawBorderInsideRect (ctx, i * S - Q, 0, T + 2*Q, F, edgeWidth);
            }
            else if (sel) {
                ctx.fillStyle = colors.hintsBG;
                ctx.fillRect(i * S - Q, 0, T + 2*Q, F);
                if (this.alwaysDrawHintsBorders || alt(i)) {
                    ctx.fillStyle = this.gradients.bg.vertical;
                    util.drawBorderInsideRect (ctx, i * S - Q, 0, T + 2*Q, F, edgeWidth);
                }
            }
        }
        ctx.translate(-F, 0);

        ctx.translate(0, F);
        for (i = 0; i < N; i++) {
            sel = (cy === i);
            if (! sel && alt(i)) {
                ctx.fillStyle = colors.hintsAltBG;
                ctx.fillRect(0, i * S - Q, F, T + 2*Q);
                ctx.fillStyle = this.gradients.alt.horizontal;
                util.drawBorderInsideRect(ctx, 0, i * S - Q, F, T + 2*Q, edgeWidth);
            }
            else if (sel) {
                ctx.fillStyle = colors.hintsBG;
                ctx.fillRect(0, i * S - Q, F, T + 2*Q);
                if (this.alwaysDrawHintsBorders || alt(i)) {
                    ctx.fillStyle = this.gradients.bg.horizontal;
                    util.drawBorderInsideRect(ctx, 0, i * S - Q, F, T + 2*Q, edgeWidth);
                }
            }
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

        var odd   = util.odd;
        var floor = Math.floor;

        this.model.eachCell(function(x, y, cell) {
            var O;

            var X = S * x;
            var Y = S * y;
            var A = X + T - 1;
            var B = Y + T - 1;

            var state = cell.state === 'filled'
                ? 'filled'
                : 'background';

            ctx.fillStyle = colors[state];
            if (self.shouldDrawCheckerboard) {
                if (state === 'background' && odd(x + y)) {
                    ctx.fillStyle = colors.checkerBG;
                }
            }
            ctx.fillRect(X, Y, T, T);

            if (self.shouldShadeSubsections && state !== 'filled') {
                var sx = floor(x/5);
                var sy = floor(y/5);

                if (odd(sx + sy)) {
                    ctx.fillStyle = colors.cellShade;
                    ctx.fillRect(X, Y, T, T);
                }
            }

            if (self.shouldShadeAllCells || state === 'filled') {
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
    draw_crosshair: function() {
        if (! this.shouldDrawCrosshair) return;

        var ctx = this.getContextByName('crosshair');
        this.clearContext(ctx);
        this.offsetContext(ctx, +1);

        var cx = this.model.x;
        var cy = this.model.y;

        var TS = this.tileSize;
        var BS = this.borderSize;
        var MS = this.model.size;
        var CS = (TS + BS) * MS - BS;

        var G = this.borderSize;
        var T = this.tileSize;
        var S = T + G;

        var X = cx * S;
        var Y = cy * S;
        var t = T - G;

        // ctx.fillStyle = colors.highlight;
        // util.drawBorderOutsideRect(ctx, X, Y, T, T, 3);

        // ctx.fillStyle = colors.cursorShadow;
        // util.drawBorderInsideRect(ctx, X, Y, T, T, 1);

        ctx.fillStyle = colors.crosshair;
        ctx.fillRect(X, 0, T,  CS);
        ctx.fillRect(0, Y, CS, T );

        ctx.fillStyle = colors.crosshairShadow;
        util.drawBorderInsideRect(ctx, X, 0, T,  CS, 1);
        util.drawBorderInsideRect(ctx, 0, Y, CS, T , 1);

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
