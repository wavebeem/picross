var util = (function() {
var max = Math.max;
var min = Math.min;
var add = function(a, b) { return a + b };

var functionCallMaker = function(prefix) {
    return function() {
        var args = [].slice.call(arguments);
        return prefix + '(' + args + ')';
    };
};

var percent = function(x) {
    return (x * 100) + '%';
};

return {
    now: (function() {
        if (typeof window.performance     === 'object'
        &&  typeof window.performance.now === 'function') {
            return function() { return performance.now() };
        }
        return function() { return +(new Date()) };
    })(),

    clamp: function(x, a, b) {
        return min(max(x, a), b);
    },

    alphaGray: function(n, a)  { return 'rgba(' + [n, n, n, a] + ')' },
    gray: function(n)          { return 'rgb('  + [n, n, n]    + ')' },

    rgba: functionCallMaker('rgba'),
    rgb:  functionCallMaker('rgb' ),

    hsl:  function(h, s, l)    { return 'hsl('  + [h, percent(s), percent(l)]    + ')' },
    hsla: function(h, s, l, a) { return 'hsla(' + [h, percent(s), percent(l), a] + ')' },

    valueOrElse: function(value, fallback) {
        return typeof value === 'undefined' ? fallback : value;
    },
    zeroPad: function(n) {
        return (n < 10 ? '0' : '') + n;
    },
    drawBorderOutsideRect: function(ctx, x, y, w, h, s) {
        var X = x - s;
        var Y = y - s;
        ctx.translate(X, Y);
        ctx.beginPath();
        var S = 2 * s;
        ctx.rect(0,     0,     w + S, 0 + s); // top
        ctx.rect(0,     0,     0 + s, h + S); // left
        ctx.rect(w + s, 0,     0 + s, h + S); // right
        ctx.rect(0,     h + s, w + S, 0 + s); // bottom
        ctx.fill();
        ctx.closePath();
        ctx.translate(-X, -Y);
    },
    drawBorderInsideRect: function(ctx, x, y, w, h, s) {
        ctx.translate(x, y);
        ctx.beginPath();
        var S = 2 * s;
        ctx.rect(0 - 0, 0 - 0, w, s); // top
        ctx.rect(0 - 0, 0 - 0, s, h); // left
        ctx.rect(w - s, 0 - 0, s, h); // right
        ctx.rect(0 - 0, h - s, w, s); // bottom
        ctx.fill();
        ctx.closePath();
        ctx.translate(-x, -y);
    },
    odd:  function(x) { return x % 2 === 1 },
    even: function(x) { return x % 2 === 0 },
    sum: function(x) {
        return _(x).foldl(add, 0);
    },
};
})();
